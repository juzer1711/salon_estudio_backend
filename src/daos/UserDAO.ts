import admin from "../config/firebase";
import { db } from "../config/firebase";

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatarUrl?: string;
}

class UserDAO {
  /**
   * Verifica si el username está disponible
   */
  static async isUsernameAvailable(
    username: string
  ): Promise<boolean> {

    const normalizedUsername =
      username.toLowerCase().trim();

    const snapshot = await db
      .collection("users")
      .where("username", "==", normalizedUsername)
      .limit(1)
      .get();

    return snapshot.empty;
  }

  /**
   * Obtener usuario por UID
   */
  static async getByUid(
    uid: string
  ): Promise<UserProfile | null> {

    const document = await db
      .collection("users")
      .doc(uid)
      .get();

    if (!document.exists) {
      return null;
    }

    return document.data() as UserProfile;
  }

  /**
   * Obtener usuario por username
   */
  static async getByUsername(
    username: string
  ): Promise<UserProfile | null> {

    const normalizedUsername =
      username.toLowerCase().trim();

    const snapshot = await db
      .collection("users")
      .where("username", "==", normalizedUsername)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0].data() as UserProfile;
  }

  /**
   * Obtener usuario por email
   */
  static async getByEmail(
    email: string
  ): Promise<UserProfile | null> {

    const normalizedEmail =
      email.toLowerCase().trim();

    const snapshot = await db
      .collection("users")
      .where("email", "==", normalizedEmail)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs[0].data() as UserProfile;
  }

  /**
   * Crear perfil
   */
  static async createProfile(
    profile: UserProfile
  ): Promise<void> {

    const normalizedUsername =
      profile.username.toLowerCase().trim();
    
    const { avatarUrl, ...rest } = profile;

    await db
      .collection("users")
      .doc(profile.uid)
      .set({
        ...rest,
        ...(avatarUrl ? { avatarUrl } : {}), // solo lo incluye si tiene valor real
        username: normalizedUsername,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  /**
   * Actualizar perfil
   */
  static async updateProfile(
    uid: string,
    data: Partial<UserProfile>
  ): Promise<void> {

    const updateData = {
      ...data,
      username: data.username?.toLowerCase().trim(),
      email: data.email?.toLowerCase().trim(),
      updatedAt:
        admin.firestore.FieldValue.serverTimestamp(),
    };

    await db
      .collection("users")
      .doc(uid)
      .update(updateData);
  }

  /**
   * Eliminar perfil
   */
  static async deleteProfile(
    uid: string
  ): Promise<void> {

    await db
      .collection("users")
      .doc(uid)
      .delete();
  }
}

// 2. Exportamos la clase y la interfaz como exportaciones nombradas
export { UserDAO };
