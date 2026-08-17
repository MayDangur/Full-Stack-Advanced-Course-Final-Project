import express from "express";



import authMiddleware from "../middleware/authMiddleware";
import profileUpload from "../middleware/profileUpload";
import validate from "../middleware/validate";



import {
  registerSchema,
  loginSchema,
  updateProfileNameSchema,
} from "../validation/authValidation";



import {
  register,
  login,
  googleSignin,
  verifyEmail,
  requestMagicLogin,
  verifyMagicLogin,
  getMe,
  updateProfileName,
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



// Verify email
router.get(
  "/verify-email",
  verifyEmail
);



// Request magic login link
router.post(
  "/magic-login",
  requestMagicLogin
);



// Verify magic login link
router.get(
  "/magic-login/verify",
  verifyMagicLogin
);



// Get current user
router.get(
  "/me",
  authMiddleware,
  getMe
);



// Update profile name
router.put(
  "/profile-name",
  authMiddleware,
  validate(updateProfileNameSchema),
  updateProfileName
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