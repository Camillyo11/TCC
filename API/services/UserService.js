const db = require("../config/db");
const bcrypt = require('bcrypt');

const UserService = {
    async createUser(nome, email, senha, telefone, data_nascimento, cep, rua, bairro, cidade, estado, tipo_endereco, numero, complemento) {
        const connection = await db.getConnection(); // Obtém uma conexão do pool
        try {
            // Inicia uma transação
            await connection.beginTransaction();

            // Hash da senha
            const hashedPassword = await bcrypt.hash(senha, 10);

            // Query de inserção do endereço
            const addressQuery = `
                INSERT INTO endereco (rua, numero, tipo_endereco, bairro, complemento, cidade, estado, cep) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

            const [addressResult] = await connection.execute(addressQuery, [rua, numero, tipo_endereco, bairro, complemento, cidade, estado, cep]);

            if (!addressResult || !addressResult.insertId) {
                throw new Error('Erro ao criar endereço: não foi possível obter o ID do endereço');
            }

            const id_endereco = addressResult.insertId;

            // Query de inserção do cliente
            const clienteQuery = `
                INSERT INTO cliente (nome, telefone, data_nascimento, email, data_registro, id_endereco) 
                VALUES (?, ?, ?, ?, CURRENT_DATE(), ?)`;

            await connection.execute(clienteQuery, [nome, telefone, data_nascimento, email, id_endereco]);

            // Se tudo ocorreu bem, faz commit da transação
            await connection.commit();

            return { success: true, message: 'Cliente cadastrado com sucesso!' };

        } catch (error) {
            // Se ocorrer algum erro, desfaz a transação (rollback)
            await connection.rollback();
            throw new Error('Erro ao criar cliente: ' + error.message);
        } finally {
            // Libera a conexão, mesmo que ocorra erro ou sucesso
            connection.release();
        }
    },

    async getUserById(userId) {
        try {
            const query = `
                SELECT c.id_cliente, c.nome, c.email, c.telefone, c.data_nascimento, c.data_registro, 
                       e.id_endereco, e.rua, e.numero, e.tipo_endereco, e.bairro, e.complemento, e.cidade, e.estado, e.cep
                FROM cliente c
                LEFT JOIN endereco e ON c.id_endereco = e.id_endereco
                WHERE c.id_cliente = ?`;

            const [rows] = await db.execute(query, [userId]);

            if (rows.length === 0) {
                throw new Error('Cliente não encontrado');
            }

            return rows[0];
        } catch (error) {
            throw new Error('Erro ao buscar cliente: ' + error.message);
        }
    }
};

module.exports = UserService;
