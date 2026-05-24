import { Response } from "express";

import { UserDAO } from "../daos/UserDAO";
import {
  createProfileSchema,
  updateProfileSchema,
} from "../schemas/userSchemas";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import admin from "../config/firebase";

// =========================================
// CHECK USERNAME AVAILABILITY
// GET /api/v1/users/check-username/:username
// =========================================

export async function checkUsername(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { username } = req.params;

    if (!username || typeof username !== "string") {
      res.status(400).json({
        message: "Parámetro de username inválido.",
      });
      return;
    }

    const available = await UserDAO.isUsernameAvailable(username);

    res.status(200).json({ available });
  } catch (error) {
    console.error("[checkUsername] Error:", error);
    res.status(500).json({
      message: "Error al verificar el username.",
    });
  }
}

// =========================================
// GET CURRENT USER PROFILE
// GET /api/v1/users/me
// =========================================

export async function getMe(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const uid = req.user?.uid;

    if (!uid) {
      res.status(401).json({ message: "No autorizado." });
      return;
    }

    const user = await UserDAO.getByUid(uid);

    if (!user) {
      res.status(200).json({ exists: false });
      return;
    }

    res.status(200).json({ exists: true, user });
  } catch (error) {
    console.error("[getMe] Error:", error);
    res.status(500).json({
      message: "Error al obtener el perfil del usuario.",
    });
  }
}

// =========================================
// CREATE USER PROFILE
// POST /api/v1/users/profile
// =========================================

export async function createProfile(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const uid = req.user?.uid;
    const email = req.user?.email;

    if (!uid || !email) {
      res.status(401).json({ message: "No autorizado." });
      return;
    }

    // Validación con Zod
    const validationResult = createProfileSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Error de validación.",
        errors: validationResult.error.flatten(),
      });
      return;
    }

    const { username, firstName, lastName, avatarUrl } = validationResult.data;

    // Verificar disponibilidad del username antes de crear
    const available = await UserDAO.isUsernameAvailable(username);

    if (!available) {
      res.status(409).json({
        message: "El username ya está en uso.",
      });
      return;
    }

    await UserDAO.createProfile({
      uid,
      email,
      username,
      firstName,
      lastName,
      avatarUrl,
    });

    res.status(201).json({
      message: "Perfil creado exitosamente.",
    });
  } catch (error) {
    console.error("[createProfile] Error:", error);
    res.status(500).json({
      message: "Error al crear el perfil.",
    });
  }
}

export async function updateProfile(
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

    const validationResult =
      updateProfileSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Error de validación.",
        errors: validationResult.error.flatten(),
      });
      return;
    }

    const {
      username,
      firstName,
      lastName,
      email,
      avatarUrl,
    } = validationResult.data;

    // Validar correo institucional
    if (
      !email.toLowerCase().endsWith(".edu.co")
    ) {
      res.status(400).json({
        message:
          "Debes usar un correo institucional .edu.co",
      });

      return;
    }

    // Verificar username
    const existingUsername =
      await UserDAO.getByUsername(username);

    if (
      existingUsername &&
      existingUsername.uid !== uid
    ) {
      res.status(409).json({
        message: "El username ya está en uso.",
      });
      return;
    }

    // Verificar email
    const existingEmail =
      await UserDAO.getByEmail(email);

    if (
      existingEmail &&
      existingEmail.uid !== uid
    ) {
      res.status(409).json({
        message: "El correo ya está en uso.",
      });
      return;
    }

    // Actualizar email en Firebase Auth
    await admin.auth().updateUser(uid, {
      email,
    });

    // Actualizar Firestore
    await UserDAO.updateProfile(uid, {
      username,
      firstName,
      lastName,
      email,
      avatarUrl,
    });

    res.status(200).json({
      message: "Perfil actualizado exitosamente.",
    });

  } catch (error) {
    console.error("[updateProfile] Error:", error);

    res.status(500).json({
      message: "Error al actualizar el perfil.",
    });
  }
}

export async function deleteAccount(
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

    // Verificar existencia del usuario
    const existingUser =
      await UserDAO.getByUid(uid);

    if (!existingUser) {
      res.status(404).json({
        message: "Usuario no encontrado.",
      });
      return;
    }

    // Eliminar perfil de Firestore
    await UserDAO.deleteProfile(uid);

    // Eliminar usuario de Firebase Auth
    await admin.auth().deleteUser(uid);

    res.status(200).json({
      message: "Cuenta eliminada exitosamente.",
    });

  } catch (error) {
    console.error("[deleteAccount] Error:", error);

    res.status(500).json({
      message: "Error al eliminar la cuenta.",
    });
  }
}