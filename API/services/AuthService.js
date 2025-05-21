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
  cpf,
  dataNascimento,
  email,
  senha,
  telefone
) => {
  try {
    if (!validarEmail(email)) {
      throw new Error('Email inválido.');
    }

    const [clienteExistente] = await db.query('SELECT * FROM cliente WHERE email = ?', [email]);
    if (clienteExistente.length > 0) {
      throw new Error('Email já cadastrado.');
    }

    // Criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10);
    const dataAtual = new Date().toISOString().split('T')[0];

    // Inserir cliente sem o id_endereco (vai ser atualizado depois)
    await db.query(
      `INSERT INTO cliente (nome, cpf, telefone, data_nascimento, email, senha, data_registro, id_endereco)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, cpf, telefone, dataNascimento, email, senhaHash, dataAtual, null] // 'null' para id_endereco por enquanto
    );

    return { message: 'Cliente cadastrado com sucesso.' };
  } catch (error) {
    logger.error(`Erro no cadastro do cliente: ${error.message}`);
    throw new Error(error.message);
  }
};


const registerAddress = async (
  usuarioId,
  endereco,
  numero_casa,
  complemento,
  cidade,
  estado,
  cep,
  bairro
) => {
  try {
    // Inserir o endereço
    const [addressResult] = await db.query(
      'INSERT INTO endereco (rua, numero, bairro, complemento, cidade, estado, cep) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [endereco, numero_casa, bairro, complemento || null, cidade, estado, cep]
    );

    const id_endereco = addressResult.insertId;

    // Atualizar o usuário com o id_endereco
    await db.query(
      'UPDATE cliente SET id_endereco = ? WHERE id_cliente = ?',
      [id_endereco, usuarioId]
    );

    return { message: 'Endereço cadastrado e associado ao cliente com sucesso!' };
  } catch (error) {
    logger.error(`Erro no cadastro do endereço: ${error.message}`);
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
