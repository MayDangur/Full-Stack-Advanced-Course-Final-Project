import express from "express";

import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";

import {
  getAllAdminTaxRequests,
  updateTaxRequestStatus,
} from "../controllers/adminController";

const router = express.Router();

// Get all tax requests from all users
router.get(
  "/requests",
  authMiddleware,
  adminMiddleware,
  getAllAdminTaxRequests
);

// Update the status of a tax request
router.patch(
  "/requests/:id/status",
  authMiddleware,
  adminMiddleware,
  updateTaxRequestStatus
);

export default router;