const AvaliacaoService = require('../services/AvaliacaoService');

const avaliacaoController = {
  async criarAvaliacao(req, res) {
    try {
      const { nota, comentario, id_pedido, id_cliente } = req.body;
      if (!nota || !id_pedido || !id_cliente) {
        return res.status(400).json({ message: 'Campos obrigatórios: nota, id_pedido, id_cliente.' });
      }
      if (nota < 1 || nota > 5) {
        return res.status(400).json({ message: 'A nota deve ser entre 1 e 5.' });
      }
      const avaliacao = await AvaliacaoService.criarAvaliacao({ nota, comentario, id_pedido, id_cliente });
      res.status(201).json(avaliacao);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async listarAvaliacoes(req, res) {
    try {
      const semResposta = req.query.semResposta === 'true';
      const avaliacoes = await AvaliacaoService.listarAvaliacoes({ semResposta });
      res.json(avaliacoes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async responderAvaliacao(req, res) {
    try {
      const { id } = req.params;
      const { resposta_loja } = req.body;
      if (!resposta_loja) {
        return res.status(400).json({ message: 'O campo resposta_loja é obrigatório.' });
      }
      const resposta = await AvaliacaoService.responderAvaliacao(id, resposta_loja);
      res.json(resposta);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = avaliacaoController;
