import express from "express";


import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";


import {
  getAllAdminTaxRequests,
  getAdminRequestDocuments,
  updateTaxRequestStatus,
} from "../controllers/adminController";


const router = express.Router();


// Get all tax requests from all users
router.get(
  "/requests",
  authMiddleware,
  adminMiddleware,
  getAllAdminTaxRequests
);


// Get all documents connected to a specific tax request
router.get(
  "/requests/:id/documents",
  authMiddleware,
  adminMiddleware,
  getAdminRequestDocuments
);


// Update the status of a tax request
router.patch(
  "/requests/:id/status",
  authMiddleware,
  adminMiddleware,
  updateTaxRequestStatus
);


export default router;