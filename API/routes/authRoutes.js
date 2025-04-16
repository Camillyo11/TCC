const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate, userValidationRules } = require('../middlewares/validator');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints para autenticação e recuperação de senha
 */

router.post(
  '/register',
  userValidationRules.register,
  validate,
  authController.register
);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: string
 *               numero_casa:
 *                 type: string
 *               complemento:
 *                 type: string
 *               cidade:
 *                 type: string
 *               estado:
 *                 type: string
 *               cep:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno
 */

router.post(
  '/login',
  userValidationRules.login,
  validate,
  authController.login
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza login
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Email ou senha inválidos
 *       500:
 *         description: Erro interno
 */

router.post('/logout', authMiddleware, authController.logout);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Realiza logout
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 */

router.get('/verify', authMiddleware, authController.verifyToken);

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verifica se o token JWT é válido
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token inválido
 */

router.post(
  '/forgot-password',
  body('email').isEmail().withMessage('Email inválido'),
  validate,
  authController.forgotPassword
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicita recuperação de senha
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email de recuperação enviado
 *       400:
 *         description: Email inválido
 *       500:
 *         description: Erro interno
 */

router.post(
  '/reset-password',
  body('token').notEmpty().withMessage('Token é obrigatório'),
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres'),
  validate,
  authController.resetPassword
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Redefine a senha do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - senha
 *             properties:
 *               token:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido ou senha fraca
 *       500:
 *         description: Erro interno
 */

// Confirmação de e-mail
router.get('/confirmar-email', authController.confirmarEmail);

module.exports = router;