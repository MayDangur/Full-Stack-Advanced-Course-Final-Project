import express from "express";

import authMiddleware from "../middleware/authMiddleware";
import profileUpload from "../middleware/profileUpload";
import validate from "../middleware/validate";

import {
  registerSchema,
  loginSchema,
} from "../validation/authValidation";

import {
  register,
  login,
  googleSignin,
  getMe,
  updateProfileImage,
  removeProfileImage,
} from "../controllers/authController";

const router = express.Router();

// Register
router.post(
  "/register",
  validate(registerSchema),
  register
);

// Login
router.post(
  "/login",
  validate(loginSchema),
  login
);

// Google Login
router.post("/google", googleSignin);

// Get current user
router.get(
  "/me",
  authMiddleware,
  getMe
);

// Upload or update profile image
router.put(
  "/profile-image",
  authMiddleware,
  profileUpload.single("profileImage"),
  updateProfileImage
);

// Remove profile image
router.delete(
  "/profile-image",
  authMiddleware,
  removeProfileImage
);

export default router;