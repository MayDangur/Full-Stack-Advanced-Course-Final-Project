import { Response, NextFunction } from "express";

import { AuthRequest } from "../middleware/authMiddleware";
import DocumentModel from "../models/Document";
import TaxRequest from "../models/TaxRequest";
import cloudinary from "../config/cloudinary";

/**
 * Upload document
 */
export const uploadDocument = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Make sure a file was actually uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { taxRequestId } = req.body;

    if (!taxRequestId) {
      return res.status(400).json({
        success: false,
        message: "Tax request ID is required",
      });
    }

    // Make sure the tax request belongs to the logged-in user
    const taxRequest = await TaxRequest.findOne({
      _id: taxRequestId,
      user: req.user?.userId,
    });

    if (!taxRequest) {
      return res.status(404).json({
        success: false,
        message: "Tax request not found",
      });
    }

    // Preserve Hebrew and other UTF-8 filenames
    const originalFileName = Buffer.from(
      req.file.originalname,
      "latin1"
    ).toString("utf8");

    // Images and PDFs can be displayed by Cloudinary.
    // Other document types are stored as raw files.
    const resourceType: "image" | "raw" =
      req.file.mimetype.startsWith("image/") ||
      req.file.mimetype === "application/pdf"
        ? "image"
        : "raw";

    // Convert the uploaded document to a data URI
    const fileData = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;

    // Upload the document to permanent cloud storage
    const uploadResult = await cloudinary.uploader.upload(
      fileData,
      {
        folder: "taxwise/documents",
        resource_type: resourceType,
      }
    );

    // Save the file information and connect it to the tax request
    const document = await DocumentModel.create({
      fileName: originalFileName,
      filePath: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      mimeType: req.file.mimetype,
      resourceType,
      taxRequest: taxRequest._id,
    });

    res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all documents by TaxRequest
 */
export const getDocumentsByTaxRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Make sure the requested tax request belongs to the logged-in user
    const taxRequest = await TaxRequest.findOne({
      _id: req.params.taxRequestId,
      user: req.user?.userId,
    });

    if (!taxRequest) {
      return res.status(404).json({
        success: false,
        message: "Tax request not found",
      });
    }

    // Find all documents connected to this tax request
    const documents = await DocumentModel.find({
      taxRequest: taxRequest._id,
    });

    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete document
 */
export const deleteDocument = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Find the document before deleting it
    const document = await DocumentModel.findById(
      req.params.id
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Make sure the document belongs to a tax request
    // owned by the logged-in user
    const taxRequest = await TaxRequest.findOne({
      _id: document.taxRequest,
      user: req.user?.userId,
    });

    if (!taxRequest) {
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
            document.resourceType || "raw",
        }
      );
    }

    // Remove the document record from MongoDB
    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};