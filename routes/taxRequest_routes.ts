import express from "express";

import authMiddleware from "../middleware/authMiddleware";
import validate from "../middleware/validate";
import { taxRequestSchema } from "../validation/taxRequestValidation";

import {
  createTaxRequest,
  getAllTaxRequests,
  getTaxRequestById,
  updateTaxRequest,
  deleteTaxRequest,
} from "../controllers/taxRequestController";

const router = express.Router();

// Create new tax request
router.post(
  "/",
  // User must be logged in before creating a request
  authMiddleware,
  // Validate the request data before reaching the controller
  validate(taxRequestSchema),
  createTaxRequest
);

// Get all tax requests (only current user)
router.get(
  "/",
  // Protect the user's personal requests
  authMiddleware,
  getAllTaxRequests
);

// Get single tax request
router.get(
  "/:id",
  // Only authenticated users can access request details
  authMiddleware,
  getTaxRequestById
);

// Update tax request
router.put(
  "/:id",
  authMiddleware,
  // Validate the updated data before saving it
  validate(taxRequestSchema),
  updateTaxRequest
);

// Delete tax request
router.delete(
  "/:id",
  // Authentication is required before deleting
  authMiddleware,
  deleteTaxRequest
);

export default router;