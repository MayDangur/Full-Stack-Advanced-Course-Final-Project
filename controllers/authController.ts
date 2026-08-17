import {
  Request,
  Response,
  NextFunction,
} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";

import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";
import cloudinary from "../config/cloudinary";
import {
  sendVerificationEmail,
  sendMagicLoginEmail,
} from "../utils/emailService";

// Google client used to verify Google ID tokens
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// Get the JWT secret from the environment
const getJwtSecret = (): string => {
  const jwtSecret = process.env.JWT_SECRET;

  // Stop token creation if the secret is missing
  if (!jwtSecret) {
    throw new Error(
      "JWT_SECRET is not defined in environment variables"
    );
  }

  return jwtSecret;
};

// Create a JWT for the authenticated user
const createToken = (
  userId: string,
  role: string
): string => {
  return jwt.sign(
    {
      userId,
      role,
    },
    getJwtSecret(),
    {
      expiresIn: "7d",
    }
  );
};

// Create a short-lived token for email verification
const createEmailVerificationToken = (
  userId: string
): string => {
  return jwt.sign(
    {
      userId,
      purpose: "email-verification",
    },
    getJwtSecret(),
    {
      expiresIn: "1h",
    }
  );
};

// Create a short-lived token for passwordless email login
const createMagicLoginToken = (
  userId: string
): string => {
  return jwt.sign(
    {
      userId,
      purpose: "magic-login",
    },
    getJwtSecret(),
    {
      expiresIn: "15m",
    }
  );
};

// Register
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const userExists = await User.findOne({
      email: email.toLowerCase(),
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    // Generate salt for password hashing
    const salt = await bcrypt.genSalt(12);

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // Save the new user in MongoDB
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isEmailVerified: false,
    });

    // Create the email verification token
    const verificationToken =
      createEmailVerificationToken(
        newUser._id.toString()
      );

    const clientUrl = process.env.CLIENT_URL;

    if (!clientUrl) {
      throw new Error(
        "CLIENT_URL is not defined in environment variables"
      );
    }

    // Send the verification link to the registered email
    await sendVerificationEmail(
      newUser.email,
      `${clientUrl}/verify-email?token=${verificationToken}`
    );

    // Return the user without the password
    res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profileImage: newUser.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Verify Email
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.query;

    if (
      !token ||
      typeof token !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid email verification link",
      });
    }

    const decoded = jwt.verify(
      token,
      getJwtSecret()
    ) as {
      userId: string;
      purpose?: string;
    };

    if (
      decoded.purpose !==
      "email-verification"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid email verification token",
      });
    }

    const user = await User.findById(
      decoded.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isEmailVerified = true;
    await user.save();

    // Create a login token after successful email verification
    const loginToken = createToken(
      user._id.toString(),
      user.role
    );

    // Return the token and user for automatic login
    res.status(200).json({
      success: true,
      message:
        "Email verified successfully",
      token: loginToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    if (
      error instanceof jwt.TokenExpiredError
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email verification link has expired",
      });
    }

    if (
      error instanceof jwt.JsonWebTokenError
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid email verification link",
      });
    }

    next(error);
  }
};

// Login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Include the password only for login validation
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    // Use the same response for an unknown email
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare the entered password with the stored hash
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Require email verification for newly registered users
    if (user.isEmailVerified === false) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email before logging in",
      });
    }

    // Create a token after successful authentication
    const token = createToken(
      user._id.toString(),
      user.role
    );

    // Send the token and user data to the client
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Google Sign In
export const googleSignin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Credential is returned by Google on the frontend
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Missing Google credential",
      });
    }

    // Use the same client ID configured for Google login
    const googleClientId =
      process.env.GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      throw new Error(
        "GOOGLE_CLIENT_ID is not defined in environment variables"
      );
    }

    // Verify that the credential was issued by Google
    const ticket =
      await googleClient.verifyIdToken({
        idToken: credential,
        audience: googleClientId,
      });

    // Read the Google account information
    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google account",
      });
    }

    // Keep emails in the same format as regular registration
    const email = payload.email.toLowerCase();

    // Check if this Google account already has a local user
    let user = await User.findOne({
      email,
    });

    // Create a user on the first Google login
    if (!user) {
      // Generate a password because the User model requires one
      const randomPassword = crypto
        .randomBytes(32)
        .toString("hex");

      const hashedPassword =
        await bcrypt.hash(
          randomPassword,
          12
        );

      user = await User.create({
        name:
          payload.name ??
          payload.given_name ??
          "Google User",
        email,
        password: hashedPassword,
        isEmailVerified: true,
      });
    } else if (
      user.isEmailVerified === false
    ) {
      // Google has already verified ownership of this email
      user.isEmailVerified = true;
      await user.save();
    }

    // Google users receive the same JWT as regular users
    const token = createToken(
      user._id.toString(),
      user.role
    );

    // Keep the response structure the same as regular login
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Request Magic Login Link
export const requestMagicLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (
      !email ||
      typeof email !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid email is required",
      });
    }

    // Find an existing account using the supplied email
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    // Use the same response whether or not the account exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists for this email, a sign-in link has been sent.",
      });
    }

    const clientUrl = process.env.CLIENT_URL;

    if (!clientUrl) {
      throw new Error(
        "CLIENT_URL is not defined in environment variables"
      );
    }

    // Create a temporary token that can only be used for magic login
    const magicToken = createMagicLoginToken(
      user._id.toString()
    );

    // Send the secure login link to the existing user's email
    await sendMagicLoginEmail(
      user.email,
      `${clientUrl}/magic-login?token=${magicToken}`
    );

    res.status(200).json({
      success: true,
      message:
        "If an account exists for this email, a sign-in link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

// Verify Magic Login Link
export const verifyMagicLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.query;

    if (
      !token ||
      typeof token !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid login link",
      });
    }

    const decoded = jwt.verify(
      token,
      getJwtSecret()
    ) as {
      userId: string;
      purpose?: string;
    };

    // Make sure an email verification token cannot be used for login
    if (decoded.purpose !== "magic-login") {
      return res.status(400).json({
        success: false,
        message: "Invalid login token",
      });
    }

    const user = await User.findById(
      decoded.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create the normal application JWT after the email link is verified
    const loginToken = createToken(
      user._id.toString(),
      user.role
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: loginToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    if (
      error instanceof jwt.TokenExpiredError
    ) {
      return res.status(400).json({
        success: false,
        message: "Login link has expired",
      });
    }

    if (
      error instanceof jwt.JsonWebTokenError
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid login link",
      });
    }

    next(error);
  }
};

// Get Current User
export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // userId was added to the request by the auth middleware
    const user = await User.findById(
      req.user?.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return the current authenticated user
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Update Profile Name
export const updateProfileName = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    // Update only the current authenticated user's name
    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      {
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return the updated user so the frontend can refresh AuthContext
    res.status(200).json({
      success: true,
      message:
        "Profile name updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Update Profile Image
export const updateProfileImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Make sure an image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No profile image uploaded",
      });
    }

    // Convert the uploaded image buffer to a data URI for Cloudinary
    const imageData = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString(
      "base64"
    )}`;

    // Upload the profile image to Cloudinary
    const uploadResult =
      await cloudinary.uploader.upload(
        imageData,
        {
          folder: "taxwise/profile-images",
          resource_type: "image",
        }
      );

    // Save the Cloudinary image URL on the current user
    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      {
        profileImage: uploadResult.secure_url,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return the user with the new profile image
    res.status(200).json({
      success: true,
      message:
        "Profile image updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Remove Profile Image
export const removeProfileImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Find the current authenticated user
    const user = await User.findById(
      req.user?.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete the current profile image from Cloudinary
    if (user.profileImage) {
      const urlParts =
        user.profileImage.split("/upload/");

      if (urlParts.length === 2) {
        const pathWithVersion =
          urlParts[1];

        const pathWithoutVersion =
          pathWithVersion.replace(
            /^v\d+\//,
            ""
          );

        const publicId =
          pathWithoutVersion.replace(
            /\.[^/.]+$/,
            ""
          );

        await cloudinary.uploader.destroy(
          publicId,
          {
            resource_type: "image",
          }
        );
      }
    }

    // Remove the profile image URL from the user
    user.profileImage = "";

    await user.save();

    // Return the updated user
    res.status(200).json({
      success: true,
      message:
        "Profile image removed successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};