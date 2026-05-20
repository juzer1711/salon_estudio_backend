import { Router } from "express";
import { authMiddleware } from "../../src/middlewares/authMiddleware";
import {
  checkUsername,
  getMe,
  createProfile,
} from "../../src/controllers/userController";

const router = Router();

router.get("/check-username/:username", checkUsername);
router.get("/me", authMiddleware, getMe);
router.post("/profile", authMiddleware, createProfile);

export default router;