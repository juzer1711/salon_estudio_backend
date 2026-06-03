import { Socket, Server} from "socket.io";
import {
  roomParticipants,
  socketRooms,
  Participant,
} from "./roomState";

function removeParticipant(
  io: Server,
  socket: Socket
): void {

  const roomId =
    socketRooms[socket.id];

  if (!roomId) {
    return;
  }

  socket.leave(roomId);

  roomParticipants[roomId] =
    roomParticipants[roomId]
      .filter(
        (participant) =>
          participant.socketId !==
          socket.id
      );

      if (
            roomParticipants[roomId]
                .length === 0
            ) {
            delete roomParticipants[
                roomId
            ];
            }

  delete socketRooms[socket.id];

  io.to(roomId).emit(
    "participants-updated",
    roomParticipants[roomId]
  );

  console.log(
    `Socket ${socket.id} left ${roomId}`
  );
}

export function registerRoomHandlers(
  io: Server,
  socket: Socket
): void {

socket.on(
    "join-room",
    (data) => {

        const {
        roomId,
        uid,
        username,
        avatarUrl,
        } = data;

        if (
        !roomId ||
        !uid ||
        !username
        ) {
        return;
        }

        socket.join(roomId);

        socketRooms[
        socket.id
        ] = roomId;

        const participant: Participant = {
        socketId: socket.id,
        uid,
        username,
        avatarUrl,
        };

        if (
        !roomParticipants[roomId]
        ) {
        roomParticipants[roomId] = [];
        }

        const alreadyExists =
        roomParticipants[roomId]
            .some(
            (p) =>
                p.socketId === socket.id
            );

        if (!alreadyExists) {

        roomParticipants[roomId]
            .push(participant);
        }

        io.to(roomId).emit(
        "participants-updated",
        roomParticipants[roomId]
        );

        console.log(
        `${username} joined ${roomId}`
        );
    }
    );

    socket.on(
  "leave-room",
  () => {

    removeParticipant(
      io,
      socket
    );
  }
);

socket.on(
  "disconnect",
  () => {

    removeParticipant(
      io,
      socket
    );

    console.log(
      `Usuario desconectado: ${socket.id}`
    );
  }
);

}