const AuthService = require('../services/AuthService');
const logger = require('../config/logger');

const register = async (req, res) => {
  try {
    const {
      nome,
      cpf,
      email,
      senha,
      telefone,
      data_nascimento,  // ✅ incluído
      endereco,
      numero_casa,
      complemento,
      cidade,
      estado,
      cep,
      bairro
    } = req.body;

    // Primeiro, registrar o usuário sem o endereço
    const responseCadastroUsuario = await AuthService.registerUser(
      nome,
      cpf,
      data_nascimento,
      email,
      senha,
      telefone
    );

    // Depois, cadastrar o endereço e associar ao usuário
    const { id_cliente } = responseCadastroUsuario;  // Supondo que o retorno da função registerUser tenha o id do usuário

    await AuthService.registerAddress(
      id_cliente,
      endereco,
      numero_casa,
      complemento,
      cidade,
      estado,
      cep,
      bairro
    );

    logger.info(`Novo usuário registrado: ${email}`);
    res.status(201).json({ message: 'Cadastro realizado com sucesso! Você já pode fazer login.' });
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

module.exports = {
  register,
  login,
  logout,
  verifyToken
};
