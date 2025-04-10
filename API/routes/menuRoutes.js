const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

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
