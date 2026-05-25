import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../src/config/swagger";
import http from "http";
import { Server } from "socket.io";
import { initializeSocketServer } from "../src/sockets/socketServer";

import routes from "./routes/routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://salon-estudio-frontend.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 4000;

const server =
  http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initializeSocketServer(io);

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
