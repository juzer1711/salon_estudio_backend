// src/config/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY as string,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.VITE_FIREBASE_APP_ID as string,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);