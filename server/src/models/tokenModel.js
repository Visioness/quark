import { prisma } from '../lib/prisma.js';

const storeToken = async (userId, token) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  return await prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  });
};

const findToken = async (token) => {
  return await prisma.refreshToken.findUnique({
    where: { token },
  });
};

const deleteToken = async (token) => {
  return await prisma.refreshToken.delete({
    where: { token },
  });
};

const deleteAllUserTokens = async (userId) => {
  return await prisma.refreshToken.deleteMany({
    where: { userId },
  });
};

const isTokenValid = async (token) => {
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token },
  });

  if (!tokenRecord) {
    const error = new Error('Invalid or revoked refresh token.');
    error.statusCode = 401;
    throw error;
  }

  if (new Date() > tokenRecord.expiresAt) {
    const error = new Error('Refresh token expired.');
    error.statusCode = 401;
    error.code = 'REFRESH_TOKEN_EXPIRED';
    throw error;
  }

  return true;
};

export {
  storeToken,
  findToken,
  deleteToken,
  deleteAllUserTokens,
  isTokenValid,
};
