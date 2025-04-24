const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

logger.info(`JWT_SECRET: ${SECRET_KEY}`);
logger.info(`JWT_EXPIRES_IN: ${JWT_EXPIRES_IN}`);

const validarEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

const registerUser = async (nome, email, senha, telefone, endereco, numero_casa, complemento, cidade, estado, cep) => {
  try {
    // Valida o formato do email
    if (!validarEmail(email)) {
      throw new Error('Email inválido.');
    }

    // Verifica se o email já está cadastrado
    const [cliente] = await db.query('SELECT * FROM cliente WHERE email = ?', [email]);
    if (cliente.length > 0) {
      throw new Error('Email já cadastrado.');
    }

    // Primeiro, inserir o endereço
    const [enderecoResult] = await db.query(
      'INSERT INTO endereco (rua, numero, tipo_endereco, bairro, complemento, cidade, estado, cep) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [endereco, numero_casa, 'residencial', 'Centro', complemento || null, cidade, estado, cep]
    );
    
    const id_endereco = enderecoResult.insertId;
    
    // Agora, inserir o cliente
    const dataAtual = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const dataNascimento = '1990-01-01'; // Valor padrão, você pode ajustar conforme necessário
    
    await db.query(
      'INSERT INTO cliente (nome, telefone, data_nascimento, email, data_registro, id_endereco, email_confirmado) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nome, telefone, dataNascimento, email, dataAtual, id_endereco, true]
    );

    return { message: 'Cliente cadastrado com sucesso.' };
  } catch (error) {
    throw new Error(error.message);
  }
};

const loginUser = async (email, senha) => {
  try {
    // Verifica se o cliente existe
    const [cliente] = await db.query('SELECT * FROM cliente WHERE email = ?', [email]);
    if (cliente.length === 0) {
      throw new Error('Email ou senha incorretos.');
    }
    
    // Gera um token JWT
    logger.info(`Gerando token para cliente: ${cliente[0].id_cliente}`);
    const token = jwt.sign({ id: cliente[0].id_cliente, email: cliente[0].email }, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
    logger.info(`Token gerado: ${token}`);

    return { token };
  } catch (error) {
    logger.error(`Erro no login: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = { registerUser, loginUser };
