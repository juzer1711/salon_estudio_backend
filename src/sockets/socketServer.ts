import { Server, Socket } from "socket.io";

export const initializeSocketServer = (
  io: Server
): void => {

  io.on("connection", (socket: Socket) => {

    console.log(
      `Usuario conectado: ${socket.id}`
    );

    /**
     * JOIN ROOM
     */

    socket.on(
      "join-room",
      (roomId: string) => {

        socket.join(roomId);

        console.log(
          `Socket ${socket.id} joined ${roomId}`
        );
      }
    );

    /**
     * SEND MESSAGE
     */

    socket.on(
      "send-message",
      async (data) => {

        const {
          roomId,
          message,
          user,
          avatarUrl,
        } = data;

        /**
         * Aquí luego:
         * guardar en Firestore
         */

        io.to(roomId).emit(
          "receive-message",
          {
            roomId,
            message,
            user,
            avatarUrl,
            createdAt:
              new Date().toISOString(),
          }
        );
      }
    );

    /**
     * DISCONNECT
     */

    socket.on(
      "disconnect",
      () => {

        console.log(
          `Usuario desconectado: ${socket.id}`
        );
      }
    );
  });
};