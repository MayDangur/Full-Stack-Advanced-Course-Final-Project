import Joi from "joi";

// Validation rules for creating and updating tax requests
export const taxRequestSchema = Joi.object({
  // Title must be between 3 and 100 characters
  title: Joi.string()
    .min(3)
    .max(100)
    .required(),

  // Description must contain enough details about the request
  description: Joi.string()
    .min(5)
    .max(500)
    .required(),

  // Status can only use one of the supported request states
  status: Joi.string()
    .valid(
      "pending",
      "approved",
      "rejected"
    )
    .optional(),
});