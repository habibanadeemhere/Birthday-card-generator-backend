import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cardRoutes from "../routes/cardRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const allowedOrigins = [
  process.env.CLIENT_URL_LOCAL,
  process.env.CLIENT_URL_PROD,

].filter(Boolean);


app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "5mb" })); 

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    dbConnected: mongoose.connection.readyState === 1,
  });
});

app.use("/api/cards", cardRoutes);

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});


export default app;




export async function connectDB() {
  if (!process.env.MONGO_URI) {
    console.warn(
      "⚠️  MONGO_URI is not set. Copy .env.example to .env and add your MongoDB connection string."
    );
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    throw err;
  }
}