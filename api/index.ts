import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../src/config/swagger";

import routes from "./routes/routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tu-frontend.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/v1", routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`
🚀 Server running on port ${PORT}
  `);
});