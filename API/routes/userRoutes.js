const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.post('/cadastro', UserController.register); 
router.get('/usuario/:id', UserController.getUser); 

module.exports = router;
