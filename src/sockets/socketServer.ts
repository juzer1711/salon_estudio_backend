import { Server, Socket } from "socket.io";

import {
  registerRoomHandlers,
} from "./roomHandlers";

import {
  registerChatHandlers,
} from "./chatHandlers";

export const initializeSocketServer = (
  io: Server
): void => {

  io.on(
    "connection",
    (socket: Socket) => {

      console.log(
        `Usuario conectado: ${socket.id}`
      );

      registerRoomHandlers(
        io,
        socket
      );

      registerChatHandlers(
        io,
        socket
      );

      socket.on(
        "disconnect",
        () => {

          console.log(
            `Usuario desconectado: ${socket.id}`
          );
        }
      );
    }
  );
};