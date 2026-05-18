import { Router } from "express";
import { checkUsernameAvailability } from "../controllers/users.controller";

const router = Router();

router.get("/check-username/:username", checkUsernameAvailability);

export default router;