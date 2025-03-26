const jwt = require('jsonwebtoken');
const SECRET_KEY = '58aba6bb59196d785f4aca3624950204403a2a2b35e40ac1e73c69d64488c8b0';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Adiciona os dados do usuário à requisição
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(401).json({ message: 'Token inválido.' });
  }
};

module.exports = authMiddleware;