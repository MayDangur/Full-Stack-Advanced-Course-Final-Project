import mongoose, { Document as MongooseDocument, Schema } from "mongoose";

export interface IDocument extends MongooseDocument {
  fileName: string;
  filePath: string;
  taxRequest: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    taxRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaxRequest",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DocumentModel = mongoose.model<IDocument>(
  "Document",
  documentSchema
);

export default DocumentModel;