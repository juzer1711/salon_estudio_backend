import { Router, Request, Response } from "express";

import {
  UserDAO,
  UserProfile,
} from "../../src/daos/UserDAO";

const router = Router();

/**
 * GET
 * /api/v1/users/check-username/:username
 */
router.get(
  "/check-username/:username",

  async (req: Request, res: Response) => {
    try {

      const { username } = req.params;

      // 1. Validación de seguridad para TypeScript y para tu base de datos
      if (!username || typeof username !== "string") {
        return res.status(400).json({
          message: "Invalid username parameter",
        });
      }

      // Ahora TypeScript sabe con 100% de certeza que 'username' es un string puro
      const available = await UserDAO.isUsernameAvailable(username);

      return res.status(200).json({
        available,
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        message: "Error checking username",
      });
    }
  }
);

/**
 * GET
 * /api/v1/users/me
 */
router.get(
  "/me",

  async (req: Request, res: Response) => {
    try {

      const uid = req.headers.uid as string;

      if (!uid) {
        return res.status(400).json({
          message: "UID missing",
        });
      }

      const user =
        await UserDAO.getByUid(uid);

      if (!user) {
        return res.status(404).json({
          exists: false,
        });
      }

      return res.status(200).json({
        exists: true,
        user,
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        message: "Error getting user",
      });
    }
  }
);

/**
 * POST
 * /api/v1/users/profile
 */
router.post(
  "/profile",

  async (req: Request, res: Response) => {
    try {

      const profile: UserProfile =
        req.body;

      const available =
        await UserDAO.isUsernameAvailable(
          profile.username
        );

      if (!available) {
        return res.status(400).json({
          message: "Username already taken",
        });
      }

      await UserDAO.createProfile(profile);

      return res.status(201).json({
        message: "Profile created successfully",
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        message: "Error creating profile",
      });
    }
  }
);

export default router;