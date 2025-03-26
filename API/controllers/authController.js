const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = '58aba6bb59196d785f4aca3624950204403a2a2b35e40ac1e73c69d64488c8b0';
const axios = require('axios');
// Cadastro de usuário
const register = async (req, res) => {
  const { nome, email, senha, telefone, endereco, numero_casa, complemento, cidade, estado, cep } = req.body;
  
  try {
    const response = await axios.get(`https://api.zerobounce.net/v2/validate?email=${email}&api_key=e33a5e0bcdc94b7da1305315ec7e96b4`);
    if (response.data.status === 'invalid') {
      return res.status(400).json({ message: 'Email inválido.' });
    }
  } catch (error) {
    console.error('Erro ao verificar email:', error);
  }
  
  if (!validarEmail(email)) {
    return res.status(400).json({ message: 'Email inválido.' });
  }
  
  try {
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length > 0) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }

    const hashedSenha = await bcrypt.hash(senha, 10);

    await db.query('INSERT INTO users (nome, email, senha, telefone, endereco, numero_casa, complemento, cidade, estado, cep) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [nome, email, hashedSenha, telefone, endereco, numero_casa, complemento, cidade, estado, cep]);

    res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
  }
};
// Login de usuário

const login = async (req, res) => {
    const { email, senha } = req.body;
  
    try {
      const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (user.length === 0) {
        return res.status(400).json({ message: 'Email ou senha incorretos.' });
      }
  
      const senhaValida = await bcrypt.compare(senha, user[0].senha);
      if (!senhaValida) {
        return res.status(400).json({ message: 'Email ou senha incorretos.' });
      }
  
      const token = jwt.sign({ id: user[0].id, email: user[0].email }, SECRET_KEY, { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ message: 'Erro ao fazer login.' });
    }
  };
  
module.exports = { register, login };