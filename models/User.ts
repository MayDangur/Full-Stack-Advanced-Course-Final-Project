import mongoose, { Document, Schema } from "mongoose";

// TypeScript structure for a user document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  profileImage?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define how users are stored in MongoDB
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Each email can belong to only one user
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Password is hidden from queries by default
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    // New users get the regular user role by default
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Stores the uploaded profile image URL
    profileImage: {
      type: String,
      default: "",
    },

    // Indicates whether the user's email address has been verified
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true,
  }
);

// Create the User model from the schema
const User = mongoose.model("User", userSchema);

export default User;