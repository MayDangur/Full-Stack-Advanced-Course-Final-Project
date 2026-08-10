import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

// Reusable middleware for validating request data
const validate = (schema: ObjectSchema) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Validate the request body using the provided Joi schema
    const { error } = schema.validate(
      req.body,
      {
        // Return all validation errors instead of stopping at the first one
        abortEarly: false,
      }
    );

    // Stop the request if validation fails
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map(
          (detail) => detail.message
        ),
      });
    }

    // Continue to the controller when the data is valid
    next();
  };
};

export default validate;