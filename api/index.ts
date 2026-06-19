// api/index.ts — fragmento del servidor con CORS corregido

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

// FIX: Los origins deben ser consistentes entre Express y Socket.io.
// Usa una variable de entorno para no hardcodear en ambos lados.
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:5173",
      "https://salon-estudio-frontend.vercel.app",
    ];

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // FIX: Mismo listado que Express, no "*".
    // "*" en Socket.io con credentials:true falla en navegadores modernos.
    origin: ALLOWED_ORIGINS,
    credentials: true,
  },
  // FIX: Configuración de transports explícita.
  // Render no soporta WebSocket puro en el plan free — polling funciona siempre.
  // Una vez que tengas un plan con soporte WS, puedes quitar "polling".
  transports: ["polling", "websocket"],
});

initializeSocketServer(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});