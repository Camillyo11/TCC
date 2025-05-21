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
 *   description: Endpoints para autenticação
 */

// Atualiza a rota de registro para refletir os dados completos (usuário + endereço)
router.post(
  '/register',
  [
    userValidationRules.register, // Validação dos dados do usuário
    body('endereco').notEmpty().withMessage('Endereço é obrigatório'), // Validação do endereço
    body('numero_casa').notEmpty().withMessage('Número da casa é obrigatório'), // Validação do número da casa
    body('bairro').notEmpty().withMessage('Bairro é obrigatório'), // Validação do bairro
    body('cidade').notEmpty().withMessage('Cidade é obrigatória'), // Validação da cidade
    body('estado').notEmpty().withMessage('Estado é obrigatório'), // Validação do estado
    body('cep').notEmpty().withMessage('CEP é obrigatório'), // Validação do CEP
  ],
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
 *               - telefone
 *               - endereco
 *               - numero_casa
 *               - bairro
 *               - cidade
 *               - estado
 *               - cep
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
 *               bairro:
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

module.exports = router;
