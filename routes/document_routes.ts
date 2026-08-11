import express from "express";

import upload from "../middleware/upload";
import DocumentModel from "../models/Document";
import cloudinary from "../config/cloudinary";

const router = express.Router();

/**
 * Upload document
 */
router.post(
  "/upload",
  // Multer handles the uploaded document
  upload.single("document"),
  async (req, res) => {
    try {
      // Make sure a file was actually uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const { taxRequestId } = req.body;

      // Preserve Hebrew and other UTF-8 filenames
      const originalFileName = Buffer.from(
        req.file.originalname,
        "latin1"
      ).toString("utf8");

      // Images and PDFs can be displayed by Cloudinary.
      // Other document types are stored as raw files.
      const resourceType:
        | "image"
        | "raw" =
        req.file.mimetype.startsWith("image/") ||
        req.file.mimetype === "application/pdf"
          ? "image"
          : "raw";

      // Convert the uploaded document to a data URI
      const fileData = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString(
        "base64"
      )}`;

      // Upload the document to permanent cloud storage
      const uploadResult =
        await cloudinary.uploader.upload(
          fileData,
          {
            folder: "taxwise/documents",
            resource_type: resourceType,
          }
        );

      // Save the file information and connect it to the tax request
      const document =
        await DocumentModel.create({
          fileName: originalFileName,
          filePath: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          mimeType: req.file.mimetype,
          resourceType,
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
      // Find all documents connected to this tax request
      const documents =
        await DocumentModel.find({
          taxRequest:
            req.params.taxRequestId,
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
      // Find the document before deleting it
      const document =
        await DocumentModel.findById(
          req.params.id
        );

      if (!document) {
        return res.status(404).json({
          success: false,
          message: "Document not found",
        });
      }

      // Delete the stored file from Cloudinary
      if (document.publicId) {
        await cloudinary.uploader.destroy(
          document.publicId,
          {
            resource_type:
              document.resourceType ||
              "raw",
          }
        );
      }

      // Remove the document record from MongoDB
      await document.deleteOne();

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