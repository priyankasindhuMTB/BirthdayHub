import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import birthdayRoutes from "./routes/birthdayRoutes.js";
import NotificationRouter from "./routes/notificationRoutes.js";

const app = express();
app.use("/uploads", express.static("uploads"));

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/profile", profileRoutes); 
app.use("/api/birthday", birthdayRoutes);
app.use("/api/notifications",NotificationRouter);
export default app;