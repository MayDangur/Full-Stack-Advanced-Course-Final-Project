import mongoose, { Document as MongooseDocument, Schema } from "mongoose";

// TypeScript structure for an uploaded document
export interface IDocument extends MongooseDocument {
  fileName: string;
  filePath: string;
  taxRequest: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define how uploaded documents are stored in MongoDB
const documentSchema = new Schema(
  {
    // Store the original name of the uploaded file
    fileName: {
      type: String,
      required: true,
    },

    // Store the saved file location
    filePath: {
      type: String,
      required: true,
    },

    // Connect each document to its tax request
    taxRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaxRequest",
      required: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true,
  }
);

// Create the Document model from the schema
const DocumentModel = mongoose.model(
  "Document",
  documentSchema
);

export default DocumentModel;