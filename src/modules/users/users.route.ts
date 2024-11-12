import { protect } from "app/middleware/authMiddleware.js";
import validate from "app/middleware/validateSchema.js";
import express from "express";
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
userRouter.post("/auth", validate(authUserSchema), authUserHandler);
userRouter.post("/logout", logoutUserHandler);
userRouter
  .route("/profile")
  .get(protect, getUserProfileHandler)
  .patch(protect, validate(updateUserSchema), updateUserProfileHandler);

export default userRouter;
