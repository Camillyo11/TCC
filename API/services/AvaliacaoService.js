const db = require('../config/db');

class AvaliacaoService {
  static async criarAvaliacao({ nota, comentario, id_pedido, id_cliente }) {
    try {
      const [result] = await db.query(
        `INSERT INTO avaliacao (data_avaliacao, nota, comentario, id_pedido, id_cliente) VALUES (CURDATE(), ?, ?, ?, ?)`,
        [nota, comentario, id_pedido, id_cliente]
      );
      return { id_avaliacao: result.insertId, nota, comentario, id_pedido, id_cliente, data_avaliacao: new Date().toISOString().slice(0, 10) };
    } catch (error) {
      throw new Error('Erro ao criar avaliação: ' + error.message);
    }
  }

  static async listarAvaliacoes({ semResposta = false } = {}) {
    try {
      let query = `SELECT * FROM avaliacao`;
      let params = [];
      if (semResposta) {
        query += ' WHERE resposta_loja IS NULL OR resposta_loja = ""';
      }
      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Erro ao buscar avaliações: ' + error.message);
    }
  }

  static async responderAvaliacao(id_avaliacao, resposta_loja) {
    try {
      const [result] = await db.query(
        `UPDATE avaliacao SET resposta_loja = ? WHERE id_avaliacao = ?`,
        [resposta_loja, id_avaliacao]
      );
      if (result.affectedRows === 0) {
        throw new Error('Avaliação não encontrada');
      }
      return { id_avaliacao, resposta_loja };
    } catch (error) {
      throw new Error('Erro ao responder avaliação: ' + error.message);
    }
  }
}

module.exports = AvaliacaoService;
