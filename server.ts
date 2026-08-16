import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth_routes";
import taxRequestRoutes from "./routes/taxRequest_routes";
import documentRoutes from "./routes/document_routes";
import adminRoutes from "./routes/admin_routes";
import errorHandler from "./middleware/errorHandler";

// Load environment variables
dotenv.config();

// Create the Express application
const app = express();

// Trust the Render proxy
app.set("trust proxy", 1);

// Allow requests from the frontend
app.use(cors());

// Add security headers
app.use(helmet());

// Parse incoming JSON requests
app.use(express.json());

// Limit requests to the API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use("/api", apiLimiter);

// Limit authentication attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts, please try again later.",
  },
});

// Routes

// Authentication routes
app.use(
  "/api/auth/register",
  authLimiter
);

app.use(
  "/api/auth/login",
  authLimiter
);

app.use(
  "/api/auth/google",
  authLimiter
);

app.use("/api/auth", authRoutes);

// Tax request routes
app.use(
  "/api/tax-requests",
  taxRequestRoutes
);

// Document upload and management routes
app.use(
  "/api/documents",
  documentRoutes
);

// Admin routes
app.use(
  "/api/admin",
  adminRoutes
);

// Global Error Handler
// Handle errors after all application routes
app.use(errorHandler);

// Use the configured MongoDB connection
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/taxwise";

// Connect the server to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err: Error) => {
    console.error(err);
  });

// Use the environment port or 5000 by default
const PORT: number =
  Number(process.env.PORT) || 5000;

// Start the Express server
app.listen(PORT, () => {
  console.log(
    `Server started on port ${PORT}`
  );
});