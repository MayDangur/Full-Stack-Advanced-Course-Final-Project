import Joi from "joi";

export const taxRequestSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required(),

  description: Joi.string()
    .min(5)
    .max(500)
    .required(),

  status: Joi.string()
    .valid(
      "pending",
      "approved",
      "rejected"
    )
    .optional(),
});