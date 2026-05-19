import admin from "../config/firebase";
import { db } from "../config/firebase";

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatarUrl: string;
}

export class UserDAO {
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
   * Crear perfil
   */
  static async createProfile(
    profile: UserProfile
  ): Promise<void> {

    const normalizedUsername =
      profile.username.toLowerCase().trim();

    await db
      .collection("users")
      .doc(profile.uid)
      .set({
        ...profile,

        username: normalizedUsername,

        createdAt:
          admin.firestore.FieldValue.serverTimestamp(),
      });
  }
}