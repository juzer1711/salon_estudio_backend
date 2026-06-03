import { Socket, Server } from "socket.io";

import { MessageDAO } from "../daos/MessageDAO";
import { RoomDAO } from "../daos/RoomDAO";

export function registerChatHandlers(
  io: Server,
  socket: Socket
): void {

  socket.on(
    "send-message",
    async (data) => {

      try {

        const {
          roomId,
          message,
          userUid,
          username,
          avatarUrl,
        } = data;

        if (
          !roomId ||
          !message ||
          !userUid ||
          !username
        ) {
          return;
        }

        const room =
          await RoomDAO.getById(
            roomId
          );

        if (!room) {

          socket.emit(
            "room-error",
            {
              message:
                "La sala no existe."
            }
          );

          return;
        }

        await MessageDAO.saveMessage({
          roomId,
          userUid,
          username,
          avatarUrl,
          message,
        });

        io.to(roomId).emit(
          "receive-message",
          {
            roomId,
            userUid,
            username,
            avatarUrl,
            message,
            createdAt:
              new Date().toISOString(),
          }
        );

      } catch (error) {

        console.error(
          "[send-message]",
          error
        );
      }
    }
  );

  socket.on(
    "get-chat-history",
    async (
      roomId: string
    ) => {

      try {

        const messages =
          await MessageDAO.getRoomMessages(
            roomId
          );

        socket.emit(
          "chat-history",
          messages
        );

      } catch (error) {

        console.error(
          "[chat-history]",
          error
        );
      }
    }
  );
}