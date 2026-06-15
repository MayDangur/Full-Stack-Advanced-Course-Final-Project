import express from "express";
import authMiddleware from "../middleware/authMiddleware";

import {
  createTaxRequest,
  getAllTaxRequests,
  getTaxRequestById,
  updateTaxRequest,
  deleteTaxRequest,
} from "../controllers/taxRequestController";

const router = express.Router();

// Create new tax request (protected)
router.post(
  "/",
  authMiddleware,
  createTaxRequest
);

// Get all requests
router.get("/", getAllTaxRequests);

// Get single request
router.get("/:id", getTaxRequestById);

// Update request
router.put("/:id", updateTaxRequest);

// Delete request
router.delete("/:id", deleteTaxRequest);

export default router;