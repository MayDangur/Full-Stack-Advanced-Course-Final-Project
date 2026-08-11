import { Response, Request } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import TaxRequest from "../models/TaxRequest";
import DocumentModel from "../models/Document";
import cloudinary from "../config/cloudinary";

// CREATE
export const createTaxRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Create a request and connect it to the logged-in user
    const taxRequest = await TaxRequest.create({
      title: req.body.title,
      description: req.body.description,
      user: req.user?.userId,
    });

    // Return the newly created request
    res.status(201).json({
      success: true,
      data: taxRequest,
    });
  } catch (error) {
    const err = error as Error;

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET ALL (Only current user's requests)
export const getAllTaxRequests = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Get only requests that belong to the logged-in user
    const requests = await TaxRequest.find({
      user: req.user?.userId,
    });

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    const err = error as Error;

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET BY ID
export const getTaxRequestById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Find the request only if it belongs to the current user
    const request = await TaxRequest.findOne({
      _id: req.params.id,
      user: req.user?.userId,
    }).populate("user", "name email");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    const err = error as Error;

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE
export const updateTaxRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Update only a request owned by the logged-in user
    const updated = await TaxRequest.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user?.userId,
      },
      {
        title: req.body.title,
        description: req.body.description,
      },
      {
        // Return the updated document and validate the new values
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    const err = error as Error;

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE
export const deleteTaxRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Find the request first and make sure it belongs to the logged-in user
    const taxRequest = await TaxRequest.findOne({
      _id: req.params.id,
      user: req.user?.userId,
    });

    if (!taxRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Find all documents connected to this tax request
    const documents = await DocumentModel.find({
      taxRequest: taxRequest._id,
    });

    // Delete every stored document from Cloudinary
    for (const document of documents) {
      if (document.publicId) {
        await cloudinary.uploader.destroy(
          document.publicId,
          {
            resource_type:
              document.resourceType || "raw",
          }
        );
      }
    }

    // Remove all document records connected to this request from MongoDB
    await DocumentModel.deleteMany({
      taxRequest: taxRequest._id,
    });

    // Delete the tax request after its documents have been removed
    await taxRequest.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Request and attached documents deleted successfully",
    });
  } catch (error) {
    const err = error as Error;

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};