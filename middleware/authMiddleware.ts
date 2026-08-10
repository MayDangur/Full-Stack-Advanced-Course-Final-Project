import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the request with the authenticated user data
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get the authorization header from the request
    const authHeader = req.headers.authorization;

    // Protected routes require a Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "No token provided",
      });
      return;
    }

    // Extract the token from the Bearer header
    const token = authHeader.split(" ")[1];

    // Verify the token and read the user data
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "taxwise_secret"
    ) as {
      userId: string;
      role: string;
    };

    // Make the authenticated user available to the next handler
    req.user = decoded;

    next();
  } catch (error) {
    // Reject invalid or expired tokens
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
    return;
  }
};

export default authMiddleware;