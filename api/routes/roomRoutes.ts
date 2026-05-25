import { Router } from "express";

import { authMiddleware }
  from "../../src/middlewares/authMiddleware";

import {
  createRoom,
  getMyRooms,
} from "../../src/controllers/roomController";

const router = Router();

/**
 * =========================================
 * CREATE ROOM
 * POST /api/v1/rooms
 * =========================================
 */

router.post(
  "/",
  authMiddleware,
  createRoom
);

/**
 * =========================================
 * GET MY ROOMS
 * GET /api/v1/rooms/my-rooms
 * =========================================
 */

router.get(
  "/my-rooms",
  authMiddleware,
  getMyRooms
);

export default router;