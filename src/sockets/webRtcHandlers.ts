import { Socket, Server } from "socket.io";

import {
  roomParticipants,
  socketRooms,
} from "./roomState";

export function registerWebRtcHandlers(
  io: Server,
  socket: Socket
): void {

  socket.on(
    "webrtc-offer",
    (data) => {

      const {
        targetSocketId,
        offer,
      } = data;

      if (
        !targetSocketId ||
        !offer
      ) {
        return;
      }


      io.to(
        targetSocketId
      ).emit(
        "receive-webrtc-offer",
        {
          fromSocketId:
            socket.id,
          offer,
        }
      );

    }
  );

  socket.on(
    "webrtc-answer",
    (data) => {

      const {
        targetSocketId,
        answer,
      } = data;

      if (
        !targetSocketId ||
        !answer
      ) {
        return;
      }

      io.to(
        targetSocketId
      ).emit(
        "receive-webrtc-answer",
        {
          fromSocketId:
            socket.id,
          answer,
        }
      );

    }
  );

  socket.on(
    "webrtc-ice-candidate",
    (data) => {

      const {
        targetSocketId,
        candidate,
      } = data;

      if (
        !targetSocketId ||
        !candidate
      ) {
        return;
      }

      io.to(
        targetSocketId
      ).emit(
        "receive-ice-candidate",
        {
          fromSocketId:
            socket.id,
          candidate,
        }
      );

    }
  );

  socket.on(
    "participant-media-state",
    (data) => {

      const roomId =
        socketRooms[socket.id];

      if (!roomId) {
        return;
      }

      const {
        isCameraOn,
        isMicrophoneOn,
      } = data ?? {};

      const participant =
        roomParticipants[roomId]
          ?.find(
            (p) =>
              p.socketId === socket.id
          );

      if (!participant) {
        return;
      }

      if (
        typeof isCameraOn === "boolean"
      ) {
        participant.isCameraOn =
          isCameraOn;
      }

      if (
        typeof isMicrophoneOn === "boolean"
      ) {
        participant.isMicrophoneOn =
          isMicrophoneOn;
      }

      socket
        .to(roomId)
        .emit(
          "participant-media-state-updated",
          {
            socketId: socket.id,
            uid: participant.uid,
            isCameraOn:
              participant.isCameraOn,
            isMicrophoneOn:
              participant.isMicrophoneOn,
          }
        );

      io.to(roomId).emit(
        "participants-updated",
        roomParticipants[roomId]
      );
    }
  );

}
