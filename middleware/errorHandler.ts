import { Request, Response, NextFunction } from "express";



// Global middleware for handling server errors
const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log the error for debugging
  console.error(err);



  // Send a consistent error response to the client
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};



export default errorHandler;