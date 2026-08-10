import mongoose, { Document, Schema } from "mongoose";

// TypeScript structure for a tax request document
export interface ITaxRequest extends Document {
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define how tax requests are stored in MongoDB
const taxRequestSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Main details provided by the user
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Every new request starts as pending
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Connect each request to the user who created it
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true,
  }
);

// Create the TaxRequest model from the schema
const TaxRequest = mongoose.model(
  "TaxRequest",
  taxRequestSchema
);

export default TaxRequest;