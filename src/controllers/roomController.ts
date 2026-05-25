import { Response } from "express";
import { nanoid } from "nanoid";

import { RoomDAO } from "../daos/RoomDAO";
import { createRoomSchema } from "../schemas/roomSchemas";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { UserDAO } from "../daos/UserDAO";

/**
 * =========================================
 * CREATE ROOM
 * POST /api/v1/rooms
 * =========================================
 */

export async function createRoom(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const uid = req.user?.uid;

    if (!uid) {
      res.status(401).json({
        message: "No autorizado.",
      });

      return;
    }

    /**
     * Validar body
     */

    const validationResult =
      createRoomSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Error de validación.",
        errors:
          validationResult.error.flatten(),
      });

      return;
    }

    const { name } =
      validationResult.data;

    /**
     * Obtener usuario actual
     */

    const user =
      await UserDAO.getByUid(uid);

    if (!user) {
      res.status(404).json({
        message: "Usuario no encontrado.",
      });

      return;
    }

    /**
     * Generar ID humano
     */

    const roomId =
      nanoid(6).toUpperCase();

    /**
     * Crear sala
     */

    await RoomDAO.createRoom({
      id: roomId,
      name,
      ownerUid: uid,
      ownerName:
        `${user.firstName} ${user.lastName}`,
    });

    res.status(201).json({
      message:
        "Sala creada exitosamente.",
      roomId,
    });

  } catch (error) {
    console.error(
      "[createRoom] Error:",
      error
    );

    res.status(500).json({
      message:
        "Error al crear la sala.",
    });
  }
}

/**
 * =========================================
 * GET MY ROOMS
 * GET /api/v1/rooms/my-rooms
 * =========================================
 */

export async function getMyRooms(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const uid = req.user?.uid;

    if (!uid) {
      res.status(401).json({
        message: "No autorizado.",
      });

      return;
    }

    const rooms =
      await RoomDAO.getRoomsByOwner(uid);

    res.status(200).json({
      rooms,
    });

  } catch (error) {
    console.error(
      "[getMyRooms] Error:",
      error
    );

    res.status(500).json({
      message:
        "Error al obtener las salas.",
    });
  }
}