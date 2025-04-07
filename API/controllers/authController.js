const AuthService = require('../services/AuthService');
const logger = require('../config/logger');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { nome, email, senha, telefone, endereco, numero_casa, complemento, cidade, estado, cep } = req.body;
    
    const response = await AuthService.registerUser(nome, email, senha, telefone, endereco, numero_casa, complemento, cidade, estado, cep);
    
    logger.info(`Novo usuário registrado: ${email}`);
    res.status(201).json(response);
  } catch (error) {
    logger.error(`Erro ao cadastrar usuário: ${error.message}`);
    res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    const response = await AuthService.loginUser(email, senha);
    
    logger.info(`Login realizado com sucesso: ${email}`);
    res.json(response);
  } catch (error) {
    logger.error(`Erro ao fazer login: ${error.message}`);
    res.status(401).json({ message: 'Email ou senha inválidos.' });
  }
};

const logout = async (req, res) => {
  try {
    
    logger.info(`Logout realizado: ${req.user.id}`);
    res.json({ message: 'Logout realizado com sucesso.' });
  } catch (error) {
    logger.error(`Erro ao fazer logout: ${error.message}`);
    res.status(500).json({ message: 'Erro ao fazer logout.' });
  }
};

const verifyToken = async (req, res) => {
  try {
    res.json({ valid: true, user: req.user });
  } catch (error) {
    logger.error(`Erro ao verificar token: ${error.message}`);
    res.status(401).json({ message: 'Token inválido.' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    
    const resetToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    
    
    logger.info(`Solicitação de recuperação de senha: ${email}`);
    res.json({ message: 'Email de recuperação enviado com sucesso.' });
  } catch (error) {
    logger.error(`Erro ao solicitar recuperação de senha: ${error.message}`);
    res.status(500).json({ message: 'Erro ao processar solicitação de recuperação de senha.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, senha } = req.body;
    
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    
    await AuthService.updatePassword(decoded.email, senha);
    
    logger.info(`Senha atualizada com sucesso: ${decoded.email}`);
    res.json({ message: 'Senha atualizada com sucesso.' });
  } catch (error) {
    logger.error(`Erro ao resetar senha: ${error.message}`);
    res.status(400).json({ message: 'Token inválido ou expirado.' });
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyToken,
  forgotPassword,
  resetPassword
};
