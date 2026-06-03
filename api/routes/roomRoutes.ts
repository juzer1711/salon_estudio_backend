import { Router } from "express";

import { authMiddleware }
  from "../../src/middlewares/authMiddleware";

import {
  createRoom,
  getMyRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} from "../../src/controllers/roomController";

const router = Router();

/**
 * @swagger
 * /api/v1/rooms:
 *   post:
 *     summary: Crear una nueva sala
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Física Cuántica
 *     responses:
 *       201:
 *         description: Sala creada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
router.post("/", authMiddleware, createRoom);

/**
 * @swagger
 * /api/v1/rooms/my-rooms:
 *   get:
 *     summary: Obtener las salas creadas por el usuario autenticado
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de salas
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/my-rooms", authMiddleware, getMyRooms);

/**
 * @swagger
 * /api/v1/rooms/{roomId}:
 *   get:
 *     summary: Obtener una sala por ID
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sala
 *     responses:
 *       200:
 *         description: Sala encontrada
 *       404:
 *         description: Sala no encontrada
 *       401:
 *         description: No autorizado
 */
router.get("/:roomId", authMiddleware, getRoomById);

/**
 * @swagger
 * /api/v1/rooms/{roomId}:
 *   patch:
 *     summary: Actualizar nombre de una sala
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sala
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Matemáticas Avanzadas
 *     responses:
 *       200:
 *         description: Sala actualizada correctamente
 *       400:
 *         description: Error de validación
 *       403:
 *         description: No tienes permisos para editar la sala
 *       404:
 *         description: Sala no encontrada
 */
router.patch("/:roomId", authMiddleware, updateRoom);

/**
 * @swagger
 * /api/v1/rooms/{roomId}:
 *   delete:
 *     summary: Eliminar una sala
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sala
 *     responses:
 *       200:
 *         description: Sala eliminada correctamente
 *       403:
 *         description: No tienes permisos para eliminar la sala
 *       404:
 *         description: Sala no encontrada
 *       401:
 *         description: No autorizado
 */
router.delete("/:roomId", authMiddleware, deleteRoom);

export default router;