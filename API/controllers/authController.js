const AuthService = require('../services/AuthService');  


const register = async (req, res) => {
  try {
    const { nome, email, senha, telefone, endereco, numero_casa, complemento, cidade, estado, cep } = req.body;
    
    
    const response = await AuthService.registerUser(nome, email, senha, telefone, endereco, numero_casa, complemento, cidade, estado, cep);
    res.status(201).json(response);
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
  }
};


const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    
    const response = await AuthService.loginUser(email, senha);
    res.json(response);
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login.' });
  }
};

module.exports = { register, login };
