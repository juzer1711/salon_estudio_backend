import admin from "../config/firebase";
import { db } from "../config/firebase";

export type RoomRole =
  | "OWNER"
  | "MEMBER";

export interface RoomMember {

  roomId: string;

  uid: string;

  role: RoomRole;

  joinedAt?: FirebaseFirestore.FieldValue;
}

class RoomMemberDAO {

  /**
   * Agregar miembro
   */
  static async addMember(
    roomId: string,
    uid: string,
    role: RoomRole
  ): Promise<void> {

    const batch =
      db.batch();

    const memberRef =
      db
        .collection("room_members")
        .doc(
          `${roomId}_${uid}`
        );

    const joinedRoomRef =
      db
        .collection("users")
        .doc(uid)
        .collection("joinedRooms")
        .doc(roomId);

    batch.set(memberRef, {
      roomId,
      uid,
      role,
      joinedAt:
        admin.firestore
          .FieldValue
          .serverTimestamp(),
    });

    batch.set(joinedRoomRef, {
      roomId,
      role,
      joinedAt:
        admin.firestore
          .FieldValue
          .serverTimestamp(),
    });

    await batch.commit();
  }

  /**
   * Eliminar miembro
   */
  static async removeMember(
    roomId: string,
    uid: string
  ): Promise<void> {

    const batch =
      db.batch();

    const memberRef =
      db
        .collection("room_members")
        .doc(
          `${roomId}_${uid}`
        );

    const joinedRoomRef =
      db
        .collection("users")
        .doc(uid)
        .collection("joinedRooms")
        .doc(roomId);

    batch.delete(memberRef);

    batch.delete(joinedRoomRef);

    await batch.commit();
  }

  /**
   * Verificar membresía
   */
  static async isMember(
    roomId: string,
    uid: string
  ): Promise<boolean> {

    const document =
      await db
        .collection("room_members")
        .doc(
          `${roomId}_${uid}`
        )
        .get();

    return document.exists;
  }

  /**
   * Obtener salas del usuario
   */
  static async getUserRooms(
    uid: string
  ): Promise<RoomMember[]> {

    const snapshot =
      await db
        .collection("room_members")
        .where(
          "uid",
          "==",
          uid
        )
        .get();

    return snapshot.docs.map(
      (doc) =>
        doc.data() as RoomMember
    );
  }
}

export {
  RoomMemberDAO,
};