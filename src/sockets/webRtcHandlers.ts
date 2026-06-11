import { Socket, Server } from "socket.io";

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

}