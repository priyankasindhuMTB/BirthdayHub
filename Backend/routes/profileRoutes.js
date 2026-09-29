import express from "express";

import {
  addProfile,
  editProfile,
  getProfile,
  uploadProfileImage
} from "../controllers/profileController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();


// ==========================================
// CREATE PROFILE
// ==========================================
router.post(
  "/add-profile",
  authenticateToken,
  addProfile
);


// ==========================================
// GET PROFILE
// ==========================================
router.get(
  "/get-profile",
  authenticateToken,
  getProfile
);


// ==========================================
// EDIT PROFILE DETAILS
// ==========================================
router.put(
  "/edit-profile",
  authenticateToken,
  editProfile
);


// ==========================================
// UPLOAD PROFILE IMAGE
// ==========================================
router.post(
  "/upload-image",
  authenticateToken,
  upload.single("profile_image"),
  uploadProfileImage
);


export default router;