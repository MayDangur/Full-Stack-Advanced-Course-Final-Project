import express from "express";

import authMiddleware from "../middleware/authMiddleware";

import {
  register,
  login,
  getMe,
} from "../controllers/authController";

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get current user
router.get(
  "/me",
  authMiddleware,
  getMe
);

export default router;