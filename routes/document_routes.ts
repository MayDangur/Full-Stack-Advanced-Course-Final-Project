import express from "express";

import upload from "../middleware/upload";
import authMiddleware from "../middleware/authMiddleware";

import {
  uploadDocument,
  getDocumentsByTaxRequest,
  deleteDocument,
} from "../controllers/documentController";

const router = express.Router();

/**
 * Upload document
 */
router.post(
  "/upload",
  authMiddleware,
  upload.single("document"),
  uploadDocument
);

/**
 * Get all documents by TaxRequest
 */
router.get(
  "/:taxRequestId",
  authMiddleware,
  getDocumentsByTaxRequest
);

/**
 * Delete document
 */
router.delete(
  "/:id",
  authMiddleware,
  deleteDocument
);

export default router;