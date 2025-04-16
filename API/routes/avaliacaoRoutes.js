const express = require('express');
const router = express.Router();
const avaliacaoController = require('../controllers/avaliacaoController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Avaliações
 *   description: Endpoints para avaliação de pedidos e resposta da loja
 */

/**
 * @swagger
 * /api/avaliacoes:
 *   post:
 *     summary: Cliente cria uma avaliação de pedido
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nota
 *               - id_pedido
 *               - id_cliente
 *             properties:
 *               nota:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comentario:
 *                 type: string
 *                 maxLength: 200
 *               id_pedido:
 *                 type: integer
 *               id_cliente:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Avaliação criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno
 *
 *   get:
 *     summary: Admin lista todas as avaliações (pode filtrar por sem resposta)
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: semResposta
 *         schema:
 *           type: boolean
 *         description: Filtrar avaliações sem resposta
 *     responses:
 *       200:
 *         description: Lista de avaliações
 *       500:
 *         description: Erro interno
 */

/**
 * @swagger
 * /api/avaliacoes/responder/{id}:
 *   post:
 *     summary: Admin responde uma avaliação
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da avaliação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resposta_loja
 *             properties:
 *               resposta_loja:
 *                 type: string
 *                 maxLength: 200
 *     responses:
 *       200:
 *         description: Resposta registrada com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno
 */

// Cliente cria avaliação
router.post('/', authMiddleware, avaliacaoController.criarAvaliacao);

// Admin vê todas as avaliações (com filtro opcional)
router.get('/', authMiddleware, adminMiddleware, avaliacaoController.listarAvaliacoes);

// Admin responde avaliação
router.post('/responder/:id', authMiddleware, adminMiddleware, avaliacaoController.responderAvaliacao);

module.exports = router;
