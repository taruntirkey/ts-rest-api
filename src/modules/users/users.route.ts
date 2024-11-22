import express from "express";
import { protect, validate, rateLimitByUser } from "@middleware/index.js";
import {
  authUserHandler,
  getUserProfileHandler,
  logoutUserHandler,
  registerUserHandler,
  updateUserProfileHandler,
} from "./users.controller.js";
import {
  authUserSchema,
  createUserSchema,
  updateUserSchema,
} from "./users.schema.js";

const userRouter = express.Router();

userRouter.post("/", validate(createUserSchema), registerUserHandler);
userRouter.post(
  "/auth",
  rateLimitByUser,
  validate(authUserSchema),
  authUserHandler
);
userRouter.post("/logout", logoutUserHandler);
userRouter
  .route("/profile")
  .get(protect, getUserProfileHandler)
  .patch(protect, validate(updateUserSchema), updateUserProfileHandler);

export default userRouter;
