import admin from "../config/firebase";
import { db } from "../config/firebase";

export interface ChatMessage {
  id?: string;

  roomId: string;

  userUid: string;

  username: string;

  avatarUrl?: string;

  message: string;

  createdAt?: FirebaseFirestore.FieldValue;
}

class MessageDAO {

  /**
   * Guardar mensaje
   */
  static async saveMessage(
    data: ChatMessage
  ): Promise<void> {

    await db
      .collection("rooms")
      .doc(data.roomId)
      .collection("messages")
      .add({
        userUid: data.userUid,
        username: data.username,
        avatarUrl: data.avatarUrl || "",
        message: data.message,
        createdAt:
          admin.firestore.FieldValue.serverTimestamp(),
      });
  }

  /**
   * Obtener historial
   */
  static async getRoomMessages(
    roomId: string,
    limitMessages: number = 100
  ): Promise<ChatMessage[]> {

    const snapshot = await db
      .collection("rooms")
      .doc(roomId)
      .collection("messages")
      .orderBy("createdAt", "asc")
      .limit(limitMessages)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      roomId,
      ...(doc.data() as Omit<ChatMessage, "roomId">),
    }));
  }
}

export { MessageDAO };