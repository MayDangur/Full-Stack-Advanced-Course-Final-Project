import { Request, Response } from "express";
import TaxRequest from "../models/TaxRequest";

// Get all tax requests for the admin
export const getAllAdminTaxRequests = async (
  req: Request,
  res: Response
) => {
  try {
    // Get requests from all users and include basic client information
    const requests = await TaxRequest.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

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

// Update only the status of a tax request
export const updateTaxRequestStatus = async (
  req: Request,
  res: Response
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
    const err = error as Error;

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};