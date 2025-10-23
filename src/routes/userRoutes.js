import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import upload from '../middleware/upload.js';
import {
  getUsers,
  getMe,
  updateMe,
  deleteMe,
  uploadAvatar,
  getUserByIdAdmin,
  updateUserByIdAdmin,
  deleteUserByIdAdmin,
} from '../controllers/userController.js';
import { validateProfileUpdate } from '../middleware/validators.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: CRUD user dan upload avatar
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Ambil semua user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar user
 */
router.get('/', verifyToken, getUsers);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Ambil profil user yang sedang login
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data profil user
 */
router.get('/me', verifyToken, getMe);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update profil user yang sedang login
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil berhasil diperbarui
 */
router.put('/me', verifyToken, validateProfileUpdate, updateMe);

/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: Hapus akun user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Akun berhasil dihapus
 */
router.delete('/me', verifyToken, deleteMe);

/**
 * @swagger
 * /api/users/me/avatar:
 *   post:
 *     summary: Upload foto profil ke Cloudinary
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar berhasil diupload
 */
router.post('/me/avatar', verifyToken, upload.single('file'), uploadAvatar);

export default router;
