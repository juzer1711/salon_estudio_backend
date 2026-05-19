import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`
🚀 Server running on port ${PORT}
  `);
});