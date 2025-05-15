const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // Adaptar os dados para garantir que id_cliente esteja disponível no req.user
    req.user = {
      id_cliente: decoded.id, // Aqui garantimos o campo correto
      email: decoded.email
    };

    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(401).json({ message: 'Token inválido.' });
  }
};

module.exports = authMiddleware;
