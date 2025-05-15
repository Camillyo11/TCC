const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const db = require('../config/db');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    logger.info(`Auth header: ${authHeader}`);
    
    if (!authHeader) {
      return res.status(401).json({
        error: {
          message: 'Token não fornecido'
        }
      });
    }
    
    const token = authHeader.split(' ')[1];
    logger.info(`Token: ${token}`);
    
    if (!token) {
      return res.status(401).json({
        error: {
          message: 'Token não fornecido'
        }
      });
    }

    logger.info(`JWT_SECRET: ${SECRET_KEY}`);
    const decoded = jwt.verify(token, SECRET_KEY);
    logger.info(`Decoded token: ${JSON.stringify(decoded)}`);
    
    // Verificar se o cliente existe no banco de dados
    const [cliente] = await db.query('SELECT * FROM cliente WHERE id_cliente = ?', [decoded.id]);
    if (cliente.length === 0) {
      return res.status(401).json({
        error: {
          message: 'Cliente não encontrado'
        }
      });
    }
    
    req.user = {
      id: cliente[0].id_cliente,
      email: cliente[0].email,
      nome: cliente[0].nome
    };
    
    logger.info(`Cliente autenticado: ${decoded.id}`);
    next();
  } catch (error) {
    logger.error(`Erro de autenticação: ${error.message}`);
    return res.status(401).json({
      error: {
        message: 'Token inválido ou expirado'
      }
    });
  }
};

// Middleware para verificar se o cliente é admin
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    logger.warn(`Tentativa de acesso não autorizado por cliente: ${req.user?.id}`);
    return res.status(403).json({
      error: {
        message: 'Acesso negado. Apenas administradores podem realizar esta ação.'
      }
    });
  }
};
module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token não fornecido.' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Busque o usuário pelo ID do token
    const user = await User.findById(decoded.id); // ajuste conforme seu model
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido.' });
  }
};
module.exports = {
  authMiddleware,
  adminMiddleware
}; 