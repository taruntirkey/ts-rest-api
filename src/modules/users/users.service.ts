import argon2 from "argon2";
import {
  InvalidCredentialsError,
  UsernameNotAvailableError,
  UserNotFoundError,
} from "./users.error.js";
import { create, getById, getByUsername, update } from "./users.repository.js";
import { AuthUser, CreateUser, UpdateUser } from "./users.schema.js";

const registerUser = async (newUser: CreateUser) => {
  // Check if user with same username already exists
  const user = await getByUsername(newUser.username);
  if (user) {
    throw new UsernameNotAvailableError();
  }

  // Hash the password
  const hashedPassword = await argon2.hash(newUser.password);
  newUser.password = hashedPassword;
  const createdUser = await create(newUser);
  return createdUser;
};

const authUser = async (auth: AuthUser) => {
  const user = await getByUsername(auth.username);
  if (!user) {
    throw new UserNotFoundError();
  }

  if (!(await argon2.verify(user.password, auth.password))) {
    throw new InvalidCredentialsError();
  }

  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
  };
};

const getUserProfile = async (userId: string) => {
  return await getById(userId);
};

const updateUserProfile = async (userId: string, updateParams: UpdateUser) => {
  const { firstname, lastname } = updateParams;
  return await update(userId, { firstname, lastname });
};

export { authUser, getUserProfile, registerUser, updateUserProfile };
