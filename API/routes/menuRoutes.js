const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController');

router.get('/pizzas', MenuController.getPizzas);
router.get('/bebidas', MenuController.getBebidas);
router.post('/pizzas', MenuController.addPizza);
router.post('/bebidas', MenuController.addBebida);
router.put('/pizzas', MenuController.updatePizza);
router.put('/bebidas', MenuController.updateBebida);
router.delete('/pizzas/:id_pizza', MenuController.removePizza);
router.delete('/bebidas/:id_bebida', MenuController.removeBebida);

module.exports = router;
