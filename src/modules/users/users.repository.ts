import prisma from "@/prisma/client.js";
import { Prisma } from "@prisma/client";

const create = async (user: Prisma.UserCreateInput) => {
  const { firstname, lastname, username, password } = user;

  return await prisma.user.create({
    data: { firstname, lastname, username, password },
    omit: {
      password: true,
    },
  });
};

const getByUsername = async (username: string) => {
  return await prisma.user.findUnique({ where: { username } });
};

const getById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true },
  });
};

const update = async (userId: string, updateParams: Prisma.UserUpdateInput) => {
  const { firstname, lastname } = updateParams;
  return await prisma.user.update({
    where: { id: userId },
    data: {
      firstname,
      lastname,
    },
    omit: {
      password: true,
    },
  });
};

export { create, getById, getByUsername, update };
