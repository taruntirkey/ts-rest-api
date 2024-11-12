import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
} from "./users.service.js";
import generateToken from "./utils/generate-token.js";

//@desc     Auth user & get token
//@route    POST /api/users/auth
//@access   Public
const authUserHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = await authUser(req.body);
  generateToken(res, user.id);
  res.send(user);
});

//@desc     Register User
//@route    POST /api/users
//@access   Public
const registerUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const createdUser = await registerUser(req.body);
    generateToken(res, createdUser.id);
    res.status(201).send(createdUser);
  }
);

//@desc     Logout User
//@route    POST /api/users/logout
//@access   Public
const logoutUserHandler = asyncHandler(async (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: "Logged out successfully" });
});

//@desc     Get User Profile
//@route    POST /api/users/profile
//@access   Private
const getUserProfileHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await getUserProfile(req.body.userId);
    res.send(user);
  }
);

//@desc     Update User Profile
//@route    PUT /api/users/profile
//@access   Private
const updateUserProfileHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const updatedUser = await updateUserProfile(req.body.userId, req.body);
    res.send(updatedUser);
  }
);

export {
  authUserHandler,
  getUserProfileHandler,
  logoutUserHandler,
  registerUserHandler,
  updateUserProfileHandler,
};
