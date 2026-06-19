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
        isCameraOn,
        isMicrophoneOn,
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
        isCameraOn:
          isCameraOn ?? true,
        isMicrophoneOn:
          isMicrophoneOn ?? true,
        isScreenSharing: false,
        };

        if (
        !roomParticipants[roomId]
        ) {
        roomParticipants[roomId] = [];
        }

        const existingParticipant =
        roomParticipants[roomId]
            .find(
            (p) =>
                p.socketId === socket.id
            );

        if (existingParticipant) {

        existingParticipant.uid = uid;
        existingParticipant.username = username;
        existingParticipant.avatarUrl = avatarUrl;
        existingParticipant.isCameraOn =
          isCameraOn ?? true;
        existingParticipant.isMicrophoneOn =
          isMicrophoneOn ?? true;

        } else {

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
  "screen-share-state",
  (isScreenSharing: boolean) => {

    const roomId = socketRooms[socket.id];

    if (!roomId) return;

    const participant =
      roomParticipants[roomId].find(
        p => p.socketId === socket.id
      );

    if (!participant) return;

    roomParticipants[roomId].forEach(
      (roomParticipant) => {

        roomParticipant.isScreenSharing =
          roomParticipant.socketId === socket.id
            ? Boolean(isScreenSharing)
            : false;

      }
    );

    io.to(roomId).emit(
      "participants-updated",
      roomParticipants[roomId]
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
