import express from "express";
import { login, register } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Route
router.get("/profile", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Profile fetched successfully",
    user: req.user
  });
});

export default router;