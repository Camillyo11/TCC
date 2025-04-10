const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController'); 
const { validate, orderValidationRules } = require('../middlewares/validator');
const { authMiddleware } = require('../middlewares/auth');

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
