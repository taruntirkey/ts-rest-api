import { Response } from "express";
import jwt from "jsonwebtoken";
import config from "../../../config/env.js";

// TODO: Upgrade to access and refresh tokens

const generateToken = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: "30d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: config.NODE_ENV !== "development", // Use secure in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;
