import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../middleware/validators.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoint untuk autentikasi user
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrasi user baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: aditya
 *               email:
 *                 type: string
 *                 example: aditya@example.com
 *               password:
 *                 type: string
 *                 example: rahasia123
 *     responses:
 *       201:
 *         description: User berhasil dibuat
 */
router.post('/register', validateRegister, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user untuk mendapatkan token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: aditya@example.com
 *               password:
 *                 type: string
 *                 example: rahasia123
 *     responses:
 *       200:
 *         description: Login berhasil
 */
router.post('/login', validateLogin, login);

export default router;
