import { Request, Response } from "express";
import { db } from "../config/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

export const checkUsernameAvailability = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.params;

    if (!username) {
      res.status(400).json({ message: "Username is required" });
      return;
    }

    const q = query(
      collection(db, "users"),
      where("username", "==", username),
      limit(1)
    );

    const snapshot = await getDocs(q);

    res.status(200).json({ available: snapshot.empty });
  } catch (error) {
    console.error("Username check error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};