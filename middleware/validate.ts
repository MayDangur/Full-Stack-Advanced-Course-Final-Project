import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

const validate = (schema: ObjectSchema) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error } = schema.validate(
      req.body,
      {
        abortEarly: false,
      }
    );

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map(
          (detail) => detail.message
        ),
      });
    }

    next();
  };
};

export default validate;