import express from "express";
import upload from "../middleware/upload";
import DocumentModel from "../models/Document";

const router = express.Router();

/**
 * Upload document
 */
router.post(
  "/upload",
  upload.single("document"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const { taxRequestId } = req.body;

      const document = await DocumentModel.create({
        fileName: req.file.filename,
        filePath: req.file.path,
        taxRequest: taxRequestId,
      });

      res.status(201).json({
        success: true,
        data: document,
      });
    } catch (error) {
      const err = error as Error;

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

/**
 * Get all documents by TaxRequest
 */
router.get(
  "/:taxRequestId",
  async (req, res) => {
    try {
      const documents =
        await DocumentModel.find({
          taxRequest: req.params.taxRequestId,
        });

      res.status(200).json({
        success: true,
        data: documents,
      });
    } catch (error) {
      const err = error as Error;

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

/**
 * Delete document
 */
router.delete(
  "/:id",
  async (req, res) => {
    try {
      const document =
        await DocumentModel.findByIdAndDelete(
          req.params.id
        );

      if (!document) {
        return res.status(404).json({
          success: false,
          message: "Document not found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Document deleted successfully",
      });
    } catch (error) {
      const err = error as Error;

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

export default router;