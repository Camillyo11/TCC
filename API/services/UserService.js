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

            // Query de inserção do usuário
            const userQuery = `
                INSERT INTO cliente (nome_cliente, email_cliente, senha_cliente, telefone_cliente, data_nascimento_cliente, data_registro) 
                VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP())`;

            const [userResult] = await connection.execute(userQuery, [nome, email, hashedPassword, telefone, data_nascimento]);

            if (!userResult || !userResult.insertId) {
                throw new Error('Erro ao criar usuário: não foi possível obter o ID do usuário');
            }

            const userId = userResult.insertId;

            // Query de inserção do endereço
            const addressQuery = `
                INSERT INTO endereco (cliente_id, cep, rua_endereco, numero_endereco, bairro_endereco, cidade_endereco, estado_endereco, tipo_endereco, complemento) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            await connection.execute(addressQuery, [userId, cep, rua, numero, bairro, cidade, estado, tipo_endereco, complemento]);

            // Se tudo ocorreu bem, faz commit da transação
            await connection.commit();

            return { success: true, message: 'Usuário cadastrado com sucesso!' };

        } catch (error) {
            // Se ocorrer algum erro, desfaz a transação (rollback)
            await connection.rollback();
            throw new Error('Erro ao criar usuário: ' + error.message);
        } finally {
            // Libera a conexão, mesmo que ocorra erro ou sucesso
            connection.release();
        }
    },

    async getUserById(userId) {
        try {
            const query = `
                SELECT c.id_cliente, c.nome_cliente, c.email_cliente, c.telefone_cliente, c.data_nascimento_cliente, 
                       e.cep, e.rua_endereco, e.numero_endereco, e.bairro_endereco, e.cidade_endereco, e.estado_endereco, e.tipo_endereco, e.complemento
                FROM cliente c
                LEFT JOIN endereco e ON c.id_cliente = e.cliente_id
                WHERE c.id_cliente = ?`;

            const [rows] = await db.execute(query, [userId]);

            if (rows.length === 0) {
                throw new Error('Usuário não encontrado');
            }

            return rows[0];
        } catch (error) {
            throw new Error('Erro ao buscar usuário: ' + error.message);
        }
    }
};

module.exports = UserService;
