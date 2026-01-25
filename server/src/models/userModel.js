import { prisma } from '../lib/prisma.js';

const createUser = async ({ username, email, password }) => {
  return await prisma.user.create({
    data: { username, email, password },
  });
};

const findUserByUsername = async (username) => {
  return await prisma.user.findUnique({
    where: { username },
  });
};

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export { createUser, findUserByUsername, findUserByEmail, findUserById };
