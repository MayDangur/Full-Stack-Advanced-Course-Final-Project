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

// GET ALL
export const getAllTaxRequests = async (
  req: Request,
  res: Response
) => {
  try {
    const requests = await TaxRequest.find().populate(
      "user",
      "name email"
    );

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
  req: Request,
  res: Response
) => {
  try {
    const request = await TaxRequest.findById(
      req.params.id
    ).populate("user", "name email");

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
  req: Request,
  res: Response
) => {
  try {
    const updated = await TaxRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
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
  req: Request,
  res: Response
) => {
  try {
    const deleted = await TaxRequest.findByIdAndDelete(
      req.params.id
    );

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