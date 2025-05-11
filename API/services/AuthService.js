const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const validarEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

const registerUser = async (
  nome,
  email,
  senha,
  telefone,
  endereco,
  numero_casa,
  complemento,
  cidade,
  estado,
  cep,
  bairro,
  dataNascimento
) => {
  try {
    if (!validarEmail(email)) {
      throw new Error('Email inválido.');
    }

    const [clienteExistente] = await db.query('SELECT * FROM cliente WHERE email = ?', [email]);
    if (clienteExistente.length > 0) {
      throw new Error('Email já cadastrado.');
    }

    // Inserir endereço (sem valores fixos)
    const [enderecoResult] = await db.query(
      `INSERT INTO endereco (rua, numero, bairro, complemento, cidade, estado, cep)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [endereco, numero_casa, bairro, complemento || null, cidade, estado, cep]
    );

    const id_endereco = enderecoResult.insertId;

    // Criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10);
    const dataAtual = new Date().toISOString().split('T')[0];

    // Inserir cliente
    await db.query(
      `INSERT INTO cliente (nome, telefone, data_nascimento, email, senha, data_registro, id_endereco)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome, telefone, dataNascimento, email, senhaHash, dataAtual, id_endereco]
    );

    return { message: 'Cliente cadastrado com sucesso.' };
  } catch (error) {
    logger.error(`Erro no cadastro: ${error.message}`);
    throw new Error(error.message);
  }
};

const loginUser = async (email, senha) => {
  try {
    const [cliente] = await db.query('SELECT * FROM cliente WHERE email = ?', [email]);
    if (cliente.length === 0) {
      throw new Error('Email ou senha incorretos.');
    }

    const clienteData = cliente[0];

    const senhaCorreta = await bcrypt.compare(senha, clienteData.senha);
    if (!senhaCorreta) {
      throw new Error('Email ou senha incorretos.');
    }

    const token = jwt.sign(
      { id: clienteData.id_cliente, email: clienteData.email },
      SECRET_KEY,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { token };
  } catch (error) {
    logger.error(`Erro no login: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  registerUser,
  loginUser
};
