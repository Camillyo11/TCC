const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/auth');

// Rotas públicas
router.post('/cadastro', UserController.register); 

// Rotas protegidas por autenticação
router.get('/cliente/:id', authMiddleware, UserController.getUser); 

module.exports = router;
