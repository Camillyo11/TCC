const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const SECRET_KEY = process.env.JWT_SECRET;


const validarEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};


const registerUser = async (nome, email, senha, telefone, endereco, numero_casa, complemento, cidade, estado, cep) => {
  try {
    // Verifica se o email é válido
    const response = await axios.get(`https://api.zerobounce.net/v2/validate?email=${email}&api_key=e33a5e0bcdc94b7da1305315ec7e96b4`);
    if (response.data.status === 'invalid') {
      throw new Error('Email inválido.');
    }

    // Valida o formato do email
    if (!validarEmail(email)) {
      throw new Error('Email inválido.');
    }

    
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length > 0) {
      throw new Error('Email já cadastrado.');
    }

    
    const hashedSenha = await bcrypt.hash(senha, 10);

   
    await db.query('INSERT INTO users (nome, email, senha, telefone, endereco, numero_casa, complemento, cidade, estado, cep) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [nome, email, hashedSenha, telefone, endereco, numero_casa, complemento, cidade, estado, cep]);

    return { message: 'Usuário cadastrado com sucesso.' };
  } catch (error) {
    throw new Error(error.message);
  }
};

const loginUser = async (email, senha) => {
  try {
    // Verifica se o usuário existe
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) {
      throw new Error('Email ou senha incorretos.');
    }

    
    const senhaValida = await bcrypt.compare(senha, user[0].senha);
    if (!senhaValida) {
      throw new Error('Email ou senha incorretos.');
    }

   
    const token = jwt.sign({ id: user[0].id, email: user[0].email }, SECRET_KEY, { expiresIn: '1h' });

    return { token };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { registerUser, loginUser };
