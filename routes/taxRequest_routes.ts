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
  authMiddleware,
  validate(taxRequestSchema),
  createTaxRequest
);

// Get all tax requests (only current user)
router.get(
  "/",
  authMiddleware,
  getAllTaxRequests
);

// Get single tax request
router.get(
  "/:id",
  authMiddleware,
  getTaxRequestById
);

// Update tax request
router.put(
  "/:id",
  authMiddleware,
  validate(taxRequestSchema),
  updateTaxRequest
);

// Delete tax request
router.delete(
  "/:id",
  authMiddleware,
  deleteTaxRequest
);

export default router;