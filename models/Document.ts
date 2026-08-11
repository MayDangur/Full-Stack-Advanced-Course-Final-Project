import mongoose, {
  Document as MongooseDocument,
  Schema,
} from "mongoose";

// TypeScript structure for an uploaded document
export interface IDocument
  extends MongooseDocument {
  fileName: string;
  filePath: string;
  publicId?: string;
  mimeType?: string;
  resourceType?: "image" | "raw";
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

    // Store the Cloudinary file URL
    filePath: {
      type: String,
      required: true,
    },

    // Store the Cloudinary public ID for file deletion
    publicId: {
      type: String,
      default: "",
    },

    // Store the original MIME type
    mimeType: {
      type: String,
      default: "",
    },

    // Store the Cloudinary resource type
    resourceType: {
      type: String,
      enum: ["image", "raw"],
      default: "raw",
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