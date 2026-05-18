import express, { Application } from "express";
import cors from "cors";
import usersRoutes from "./routes/users.routes";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", usersRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", message: "Backend running" });
});

export default app;