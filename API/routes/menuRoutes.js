const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Endpoints para gerenciamento do cardápio de pizzas e bebidas
 */

/**
 * @swagger
 * /api/menu/pizzas:
 *   get:
 *     summary: Lista todas as pizzas
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: Lista de pizzas
 *       500:
 *         description: Erro interno
 *   post:
 *     summary: Adiciona uma nova pizza (admin)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sabor:
 *                 type: string
 *               preco_sabor:
 *                 type: number
 *               tipo_borda:
 *                 type: string
 *               preco_borda:
 *                 type: number
 *               tamanho:
 *                 type: string
 *               observacao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pizza adicionada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 *   put:
 *     summary: Atualiza uma pizza (admin)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_pizza:
 *                 type: integer
 *               sabor:
 *                 type: string
 *               preco_sabor:
 *                 type: number
 *               tipo_borda:
 *                 type: string
 *               preco_borda:
 *                 type: number
 *               tamanho:
 *                 type: string
 *               observacao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pizza atualizada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 *
 * /api/menu/pizzas/{id_pizza}:
 *   delete:
 *     summary: Remove uma pizza (admin)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_pizza
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da pizza
 *     responses:
 *       200:
 *         description: Pizza removida
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Pizza não encontrada
 *       500:
 *         description: Erro interno
 *
 * /api/menu/bebidas:
 *   get:
 *     summary: Lista todas as bebidas
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: Lista de bebidas
 *       500:
 *         description: Erro interno
 *   post:
 *     summary: Adiciona uma nova bebida (admin)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               tamanho:
 *                 type: string
 *               preco:
 *                 type: number
 *     responses:
 *       201:
 *         description: Bebida adicionada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 *   put:
 *     summary: Atualiza uma bebida (admin)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_bebida:
 *                 type: integer
 *               nome:
 *                 type: string
 *               tamanho:
 *                 type: string
 *               preco:
 *                 type: number
 *     responses:
 *       200:
 *         description: Bebida atualizada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 *
 * /api/menu/bebidas/{id_bebida}:
 *   delete:
 *     summary: Remove uma bebida (admin)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_bebida
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da bebida
 *     responses:
 *       200:
 *         description: Bebida removida
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Bebida não encontrada
 *       500:
 *         description: Erro interno
 */

// Rotas públicas
router.get('/pizzas', MenuController.getPizzas);
router.get('/bebidas', MenuController.getBebidas);

// Rotas protegidas por autenticação e admin
router.post('/pizzas', authMiddleware, adminMiddleware, MenuController.addPizza);
router.post('/bebidas', authMiddleware, adminMiddleware, MenuController.addBebida);
router.put('/pizzas', authMiddleware, adminMiddleware, MenuController.updatePizza);
router.put('/bebidas', authMiddleware, adminMiddleware, MenuController.updateBebida);
router.delete('/pizzas/:id_pizza', authMiddleware, adminMiddleware, MenuController.removePizza);
router.delete('/bebidas/:id_bebida', authMiddleware, adminMiddleware, MenuController.removeBebida);

module.exports = router;
