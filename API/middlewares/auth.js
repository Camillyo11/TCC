const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: {
          message: 'Token não fornecido'
        }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    logger.info(`Usuário autenticado: ${decoded.id}`);
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

// Middleware para verificar se o usuário é admin
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    logger.warn(`Tentativa de acesso não autorizado por usuário: ${req.user?.id}`);
    return res.status(403).json({
      error: {
        message: 'Acesso negado. Apenas administradores podem realizar esta ação.'
      }
    });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware
}; 