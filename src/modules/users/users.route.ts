import { protect } from "../../middleware/authMiddleware.js";
import validate from "../../middleware/validateSchema.js";
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
import { rateLimitByUser } from "../../middleware/apiRateLimitMiddleware.js";

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
