import { Router } from "express";
import { authMiddleware } from "../../src/middlewares/authMiddleware";
import {
  checkUsername,
  getMe,
  createProfile,
  updateProfile,
  deleteAccount,
} from "../../src/controllers/userController";

const router = Router();

/**
 * @swagger
 * /api/v1/users/check-username/{username}:
 *   get:
 *     summary: Verificar disponibilidad de nombre de usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de usuario
 *     responses:
 *       200:
 *         description: Verificación realizada correctamente
 */
router.get("/check-username/:username", checkUsername);

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Datos del usuario
 */
router.get("/me", authMiddleware, getMe);

/**
 * @swagger
 * /api/v1/users/me:
 *   put:
 *     summary: Actualizar perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       409:
 *         description: Username o correo ya en uso
 */
router.put("/me", authMiddleware, updateProfile);

/**
 * @swagger
 * /api/v1/users/me:
 *   delete:
 *     summary: Eliminar cuenta del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cuenta eliminada correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/me", authMiddleware, deleteAccount);

/**
 * @swagger
 * /api/v1/users/profile:
 *   post:
 *     summary: Crear perfil de usuario
 *     tags: [Users]
 *     responses:
 *       201:
 *         description: Perfil creado correctamente
 */
router.post("/profile", authMiddleware, createProfile);

export default router;