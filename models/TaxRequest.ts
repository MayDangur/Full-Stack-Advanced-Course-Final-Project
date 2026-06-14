import mongoose, { Document, Schema } from "mongoose";

export interface ITaxRequest extends Document {
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taxRequestSchema = new Schema<ITaxRequest>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TaxRequest = mongoose.model<ITaxRequest>(
  "TaxRequest",
  taxRequestSchema
);

export default TaxRequest;