const UserService = require('../services/UserService');
const responseHandler = require('../utils/responseHandler');

const UserController = {
    async register(req, res) {
        try {
            const { nome, email, senha, telefone, data_nascimento, cep, rua, bairro, cidade, estado, tipo_endereco, numero, complemento } = req.body;
            const result = await UserService.createUser(nome, email, senha, telefone, data_nascimento, cep, rua, bairro, cidade, estado, tipo_endereco, numero, complemento);
            responseHandler.success(res, result, 'Cliente cadastrado com sucesso!', 201);
        } catch (error) {
            responseHandler.error(res, error);
        }
    },

    async getUser(req, res) {
        try {
            const clienteId = req.params.id;
            const cliente = await UserService.getUserById(clienteId);
            responseHandler.success(res, cliente, 'Cliente encontrado com sucesso!');
        } catch (error) {
            responseHandler.error(res, error, 404);
        }
    },

   async getProfile(req, res) {
    try {
        const cliente = await UserService.getUserById(req.user.id); // Busca dados completos
        res.json(cliente); // Retorna todos os dados para o front
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar perfil do usuário.' });
    }
},

    async updateProfile(req, res) {
  try {
    const { nome, email, telefone } = req.body;

    // Usa os valores do body se forem válidos, senão pega do token (req.user)
    const nomeFinal = nome?.trim() || req.user.nome || null;
    const emailFinal = email?.trim() || req.user.email || null;
    const telefoneFinal = telefone?.trim() || req.user.telefone || null;

    const updatedUser = await UserService.updateUser(req.user.id, {
      nome: nomeFinal,
      email: emailFinal,
      telefone: telefoneFinal
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Erro no updateProfile:', error);
    res.status(500).json({ message: error.message });
  }
}
};

module.exports = UserController;
