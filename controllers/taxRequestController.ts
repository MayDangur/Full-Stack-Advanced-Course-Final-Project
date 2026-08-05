import { Response, Request } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import TaxRequest from "../models/TaxRequest";

// CREATE
export const createTaxRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const taxRequest = await TaxRequest.create({
      title: req.body.title,
      description: req.body.description,
      user: req.user?.userId,
    });

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
    const deleted = await TaxRequest.findOneAndDelete({
      _id: req.params.id,
      user: req.user?.userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    const err = error as Error;

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};