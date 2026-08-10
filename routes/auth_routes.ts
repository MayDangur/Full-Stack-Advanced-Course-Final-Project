import express from "express";

import authMiddleware from "../middleware/authMiddleware";

import {
  register,
  login,
  googleSignin,
  getMe,
} from "../controllers/authController";

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Google Login
router.post("/google", googleSignin);

// Get current user
router.get(
  "/me",
  authMiddleware,
  getMe
);

export default router;