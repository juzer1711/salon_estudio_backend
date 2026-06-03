import admin from "../config/firebase";
import { db } from "../config/firebase";

export interface StudyRoom {
  id: string;

  name: string;

  ownerUid: string;

  ownerName: string;

  createdAt?: FirebaseFirestore.FieldValue;
}

class RoomDAO {

  /**
   * Crear sala
   */
  static async createRoom(
    room: StudyRoom
  ): Promise<void> {

    await db
      .collection("rooms")
      .doc(room.id)
      .set({
        ...room,
        createdAt:
          admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  /**
   * Obtener salas del usuario
   */
  static async getRoomsByOwner(
    ownerUid: string
  ): Promise<StudyRoom[]> {

    const snapshot = await db
      .collection("rooms")
      .where("ownerUid", "==", ownerUid)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      ...(doc.data() as StudyRoom),
    }));
  }

  /**
   * Obtener sala por ID
   */
  static async getById(
    roomId: string
  ): Promise<StudyRoom | null> {

    const document = await db
      .collection("rooms")
      .doc(roomId)
      .get();

    if (!document.exists) {
      return null;
    }

    return document.data() as StudyRoom;
  }

  /**
   * Actualizar nombre de sala
   */
  static async updateRoom(
    roomId: string,
    name: string
  ): Promise<void> {

    await db
      .collection("rooms")
      .doc(roomId)
      .update({
        name,
      });
  }

  /**
   * Eliminar sala
   */
  static async deleteRoom(
    roomId: string
  ): Promise<void> {

    await db
      .collection("rooms")
      .doc(roomId)
      .delete();
  }
}

export { RoomDAO };