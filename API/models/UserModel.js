const db = require("../config/db");

const UserModel = {
    async create(nome, email, hashedPassword, telefone, data_nascimento) {
        const query = `
            INSERT INTO cliente (nome_cliente, email_cliente, senha_cliente, telefone_cliente, data_nascimento_cliente, data_registro) 
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP())`;
        const [result] = await db.execute(query, [nome, email, hashedPassword, telefone, data_nascimento]);
        return result.insertId; // Retorna o ID do usuário criado
    },

    async findById(userId) {
        const query = `
            SELECT * FROM cliente WHERE id_cliente = ?`;
        const [rows] = await db.execute(query, [userId]);
        return rows[0] || null;
    }
};

module.exports = UserModel;
