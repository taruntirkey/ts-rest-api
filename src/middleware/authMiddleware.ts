import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/env.js";

interface IJwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

const protect = async (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.cookies.jwt;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as IJwtPayload;
    req.body.userId = decoded.userId;
    next();
  } catch (err) {
    console.log(err);
    res.status(401);
    throw new Error("Not authorized, invalid token");
  }
};

export { protect };
