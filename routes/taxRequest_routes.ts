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

// Get all requests
router.get("/", getAllTaxRequests);

// Get single request
router.get("/:id", getTaxRequestById);

// Update request
router.put(
  "/:id",
  authMiddleware,
  validate(taxRequestSchema),
  updateTaxRequest
);

// Delete request
router.delete(
  "/:id",
  authMiddleware,
  deleteTaxRequest
);

export default router;