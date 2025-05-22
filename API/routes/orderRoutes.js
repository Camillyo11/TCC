const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController'); 
const { validate, orderValidationRules } = require('../middlewares/validator');
const { authMiddleware } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Endpoints para gerenciamento de pedidos
 */

/**
 * @swagger
 * /api/orders/create:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_cliente
 *               - total
 *               - metodo_pagamento
 *               - tipo_entrega
 *               - id_endereco
 *               - pizzas
 *             properties:
 *               id_cliente:
 *                 type: integer
 *               total:
 *                 type: number
 *               metodo_pagamento:
 *                 type: string
 *               tipo_entrega:
 *                 type: string
 *               observacoes:
 *                 type: string
 *               id_endereco:
 *                 type: integer
 *               pizzas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     tipo_borda:
 *                       type: string
 *                     preco_borda:
 *                       type: number
 *                     tamanho:
 *                       type: string
 *                     observacao:
 *                       type: string
 *                     sabores:
 *                       type: array
 *                       items:
 *                         type: integer
 *               bebidas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nome:
 *                       type: string
 *                     tamanho:
 *                       type: string
 *                     preco:
 *                       type: number
 *     responses:
 *       201:
 *         description: Pedido criado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 *
 * /api/orders/client/{id_cliente}:
 *   get:
 *     summary: Lista todos os pedidos de um cliente
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_cliente
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 *
 * /api/orders/status:
 *   put:
 *     summary: Atualiza o status de um pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_pedido
 *               - status
 *             properties:
 *               id_pedido:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [pendente, em_preparo, entregue, cancelado]
 *     responses:
 *       200:
 *         description: Status atualizado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 *
 * /api/orders/details/{id_pedido}:
 *   get:
 *     summary: Detalhes de um pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_pedido
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Detalhes do pedido
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro interno
 *
 * /api/orders/pizza/{id_pizza}/{id_pedido}:
 *   put:
 *     summary: Atualiza uma pizza em um pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_pizza
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da pizza
 *       - in: path
 *         name: id_pedido
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo_borda
 *               - preco_borda
 *               - tamanho
 *               - sabores
 *             properties:
 *               tipo_borda:
 *                 type: string
 *               preco_borda:
 *                 type: number
 *               tamanho:
 *                 type: string
 *               observacao:
 *                 type: string
 *               sabores:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Pizza atualizada
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Pedido ou pizza não encontrados
 *       500:
 *         description: Erro interno
 *   delete:
 *     summary: Remove uma pizza de um pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_pizza
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da pizza
 *       - in: path
 *         name: id_pedido
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pizza removida
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Pedido ou pizza não encontrados
 *       500:
 *         description: Erro interno
 *
 * /api/orders/bebida/{id_bebida}/{id_pedido}:
 *   put:
 *     summary: Atualiza uma bebida em um pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_bebida
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da bebida
 *       - in: path
 *         name: id_pedido
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - tamanho
 *               - preco
 *             properties:
 *               nome:
 *                 type: string
 *               tamanho:
 *                 type: string
 *               preco:
 *                 type: number
 *     responses:
 *       200:
 *         description: Bebida atualizada
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Pedido ou bebida não encontrados
 *       500:
 *         description: Erro interno
 *   delete:
 *     summary: Remove uma bebida de um pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_bebida
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da bebida
 *       - in: path
 *         name: id_pedido
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Bebida removida
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Pedido ou bebida não encontrados
 *       500:
 *         description: Erro interno
 */

// Rotas protegidas por autenticação
router.post('/create', authMiddleware, orderValidationRules.create, validate, OrderController.createOrder);
router.get('/client/:id_cliente', authMiddleware, OrderController.getOrdersByClient);
router.put('/status', authMiddleware, orderValidationRules.updateStatus, validate, OrderController.updateOrderStatus);
router.get('/details/:id_pedido', authMiddleware, OrderController.getOrderDetails);
router.put('/pizza/:id_pizza/:id_pedido', authMiddleware, OrderController.updatePizza);
router.put('/bebida/:id_bebida/:id_pedido', authMiddleware, OrderController.updateBebida);
router.delete('/pizza/:id_pizza/:id_pedido', authMiddleware, OrderController.removePizza);
router.delete('/bebida/:id_bebida/:id_pedido', authMiddleware, OrderController.removeBebida);

module.exports = router;
