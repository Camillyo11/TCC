const AuthService = require('../services/AuthService');
const logger = require('../config/logger');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../utils/email');

const register = async (req, res) => {
  try {
    const { nome, email, senha, telefone, endereco, numero_casa, complemento, cidade, estado, cep } = req.body;
    
    const response = await AuthService.registerUser(nome, email, senha, telefone, endereco, numero_casa, complemento, cidade, estado, cep);
    
    // Enviar e-mail de confirmação
    const confirmLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/confirmar-email?token=${response.emailToken}`;
    await sendMail({
      to: response.email,
      subject: 'Confirme seu cadastro - Bellamassa',
      html: `<p>Bem-vindo à Bellamassa!</p><p>Para ativar sua conta, clique no link abaixo:</p><p><a href="${confirmLink}">${confirmLink}</a></p>`
    });

    logger.info(`Novo usuário registrado: ${email}`);
    res.status(201).json({ message: 'Cadastro realizado! Verifique seu e-mail para confirmar a conta.' });
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

    // Verifica se o usuário existe
    const [cliente] = await require('../config/db').query('SELECT * FROM cliente WHERE email = ?', [email]);
    if (cliente.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const resetToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    await sendMail({
      to: email,
      subject: 'Recuperação de senha - Bellamassa',
      html: `<p>Olá,</p><p>Recebemos uma solicitação para redefinir sua senha. Clique no link abaixo para criar uma nova senha:</p><p><a href="${resetLink}">${resetLink}</a></p><p>Se não foi você, ignore este e-mail.</p>`
    });

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

const confirmarEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Token não fornecido.' });
    const db = require('../config/db');
    const [rows] = await db.query('SELECT * FROM cliente WHERE email_token = ?', [token]);
    if (rows.length === 0) return res.status(400).json({ message: 'Token inválido.' });
    await db.query('UPDATE cliente SET email_confirmado = 1, email_token = NULL WHERE id_cliente = ?', [rows[0].id_cliente]);
    res.json({ message: 'E-mail confirmado com sucesso! Você já pode fazer login.' });
  } catch (error) {
    logger.error(`Erro ao confirmar e-mail: ${error.message}`);
    res.status(500).json({ message: 'Erro ao confirmar e-mail.' });
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyToken,
  forgotPassword,
  resetPassword,
  confirmarEmail
};
