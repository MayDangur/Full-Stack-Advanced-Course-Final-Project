import { Request, Response, NextFunction } from "express";
import TaxRequest from "../models/TaxRequest";
import DocumentModel from "../models/Document";

// Supported tax request statuses used for admin filtering
type TaxRequestStatus =
  | "pending"
  | "approved"
  | "rejected";

// Get all tax requests for the admin
export const getAllAdminTaxRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.query;

    // Apply an optional status filter while keeping all requests as the default
    const filter: { status?: TaxRequestStatus } = {};

    if (
      status === "pending" ||
      status === "approved" ||
      status === "rejected"
    ) {
      filter.status = status;
    }

    // Get requests from all users and include basic client information
    const requests = await TaxRequest.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// Get all documents connected to a specific tax request
export const getAdminRequestDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Make sure the tax request exists
    const taxRequest = await TaxRequest.findById(
      req.params.id
    );

    if (!taxRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Get all documents connected to this tax request
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

// Update only the status of a tax request
export const updateTaxRequestStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;

    // Only supported request statuses are allowed
    if (
      !["pending", "approved", "rejected"].includes(
        status
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request status",
      });
    }

    const updatedRequest =
      await TaxRequest.findByIdAndUpdate(
        req.params.id,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate("user", "name email");

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Request status updated successfully",
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};