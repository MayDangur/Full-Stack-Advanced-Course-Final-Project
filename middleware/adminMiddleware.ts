import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

// Allow access only to authenticated admin users
const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // The authentication middleware must run before this middleware
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  // Regular users are not allowed to access admin routes
  if (req.user.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Admin access required",
    });
    return;
  }

  next();
};

export default adminMiddleware;