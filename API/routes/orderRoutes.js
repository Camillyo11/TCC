const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController'); 

router.post('/create', OrderController.createOrder);
router.get('/client/:id_cliente', OrderController.getOrdersByClient);
router.put('/status', OrderController.updateOrderStatus);
router.get('/details/:id_pedido', OrderController.getOrderDetails);
router.put('/pizza/:id_pizza/:id_pedido', OrderController.updatePizza);
router.put('/bebida/:id_bebida/:id_pedido', OrderController.updateBebida);
router.delete('/pizza/:id_pizza/:id_pedido', OrderController.removePizza);
router.delete('/bebida/:id_bebida/:id_pedido', OrderController.removeBebida);

module.exports = router;
