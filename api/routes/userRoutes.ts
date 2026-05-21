import { Router } from "express";
import { authMiddleware } from "../../src/middlewares/authMiddleware";
import {
  checkUsername,
  getMe,
  createProfile,
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