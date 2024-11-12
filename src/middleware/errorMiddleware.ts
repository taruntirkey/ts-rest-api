import config from "app/config/env.js";
import { UserError } from "app/modules/users/users.error.js";
import { NextFunction, Request, Response } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err instanceof UserError) {
    statusCode = err.cause.errorCode;
  }

  res.status(statusCode).json({
    message,
    stack: config.NODE_ENV === "production" ? null : err.stack,
  });
};

export { errorHandler, notFound };
