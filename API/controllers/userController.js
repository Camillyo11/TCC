const UserService = require('../services/UserService');
const responseHandler = require('../utils/responseHandler');

const UserController = {
    async register(req, res) {
        try {
            const { nome, email, senha, telefone, data_nascimento, cep, rua, bairro, cidade, estado, tipo_endereco, numero, complemento } = req.body;
            
            const result = await UserService.createUser(nome, email, senha, telefone, data_nascimento, cep, rua, bairro, cidade, estado, tipo_endereco, numero, complemento);
            
            responseHandler.success(res, result, 'Usuário cadastrado com sucesso!', 201);
        } catch (error) {
            responseHandler.error(res, error);
        }
    },

    async getUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await UserService.getUserById(userId);

            responseHandler.success(res, user, 'Usuário encontrado com sucesso!');
        } catch (error) {
            responseHandler.error(res, error, 404);
        }
    }
};

module.exports = UserController;
