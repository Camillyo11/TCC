const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate, userValidationRules } = require('../middlewares/validator');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth');


router.post(
  '/register',
  userValidationRules.register,
  validate,
  authController.register
);


router.post(
  '/login',
  userValidationRules.login,
  validate,
  authController.login
);


router.post('/logout', authMiddleware, authController.logout);


router.get('/verify', authMiddleware, authController.verifyToken);


router.post(
  '/forgot-password',
  body('email').isEmail().withMessage('Email inválido'),
  validate,
  authController.forgotPassword
);


router.post(
  '/reset-password',
  body('token').notEmpty().withMessage('Token é obrigatório'),
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres'),
  validate,
  authController.resetPassword
);

module.exports = router;