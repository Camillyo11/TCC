// controllers/userController.js
const getUsers = (req, res) => {
    res.send([
        { id: 1, nome: 'João Silva', email: 'joao@pizza.com' },
        { id: 2, nome: 'Maria Souza', email: 'maria@pizza.com' }
    ]);
};

const createUser = (req, res) => {
    const { nome, email } = req.body;
    res.status(201).send({ mensagem: 'Usuário criado com sucesso!', nome, email });
};

module.exports = { getUsers, createUser };
