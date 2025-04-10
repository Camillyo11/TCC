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
    }
};

module.exports = UserController;
