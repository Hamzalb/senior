// --- Imports ---
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import barterRoutes from "./routes/barterRoutes";
import productRoutes from "./routes/productRoutes";
import adminRoutes from "./routes/adminRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import messageRoutes from "./routes/messageRoutes";
import { notFound, errorHandler } from "./middleware/errorMiddleware";
import { initSocket } from "./socket";

dotenv.config();
const app = express();
const httpServer = createServer(app);
// --- Middleware Setup ---
const FRONTEND_URLS = [
  "https://senior-frontend-eta.vercel.app",
  "http://localhost:3000",
  "http://localhost:5050",
  "http://192.168.56.1:3000",
  "http://192.168.56.1:5050",
];

app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      // allow requests with no origin (like mobile apps or curl)
      if (!incomingOrigin) return callback(null, true);

      if (FRONTEND_URLS.includes(incomingOrigin)) {
        // echo back the exact origin
        callback(null, incomingOrigin);
      } else {
        callback(
          new Error(`CORS policy: origin ${incomingOrigin} not allowed`),
          false
        );
      }
    },
    credentials: true, // send Access-Control-Allow-Credentials: true
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      // send Access-Control-Allow-Headers
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  })
);
app.use(express.json());
app.use(cookieParser());

// --- Health Check Route ---
app.get("/", (req, res) => {
  res.send("Backend is running ✨");
});

// 3) Your routes (MUST come *after* the static line)
app.use("/api/barter", barterRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);

// 4) Error handlers
app.use(notFound);
app.use(errorHandler);

// --- MongoDB Connection & Server Start ---
const PORT = Number(process.env.PORT) || 5001;

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("✅ MongoDB connected");
    
    // Initialize Socket.io
    initSocket(httpServer);
    console.log("🔌 Socket.io initialized");
    
    // Start server with HTTP server (required for Socket.io)
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err: any) => console.error("❌ MongoDB connection error:", err));
