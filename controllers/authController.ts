import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import {
  AuthRequest,
} from "../middleware/authMiddleware";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);
// Register
export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({
      email: email.toLowerCase(),
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "אימייל זה כבר קיים במערכת",
      });
    }

    const salt = await bcrypt.genSalt(12);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "המשתמש נרשם בהצלחה!",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    const err = error as Error;

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Login
export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

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

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "taxwise_secret",
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    const err = error as Error;

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const googleSignin = async (
  req: Request,
  res: Response
) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Missing Google credential",
      });
    }

    const ticket =
      await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google account",
      });
    }

    let user = await User.findOne({
      email: payload.email.toLowerCase(),
    }).select("+password");

    if (!user) {
      const randomPassword =
        crypto.randomBytes(32).toString("hex");

      const hashedPassword =
        await bcrypt.hash(
          randomPassword,
          12
        );

      user = await User.create({
        name:
          payload.name ??
          "Google User",
        email:
          payload.email.toLowerCase(),
        password: hashedPassword,
      });

      user = await User.findById(
        user._id
      ).select("+password");
    }

    const token = jwt.sign(
      {
        userId: user!._id,
        role: user!.role,
      },
      process.env.JWT_SECRET ||
        "taxwise_secret",
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user!._id,
        name: user!.name,
        email: user!.email,
        role: user!.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(401).json({
      success: false,
      message:
        "Google authentication failed",
    });
  }
};
// Get current user
export const getMe = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = await User.findById(
      req.user?.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    const err = error as Error;

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};