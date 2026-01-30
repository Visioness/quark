import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userModel from '../models/userModel.js';
import * as tokenModel from '../models/tokenModel.js';
import { generateAccessToken, generateRefreshToken } from '../auth/tokens.js';

const registerUser = async ({ username, email, password }) => {
  let existingUser = await userModel.findUserByUsername(username);
  if (existingUser) {
    const error = new Error('Username already exists.');
    error.statusCode = 409;
    throw error;
  }

  existingUser = await userModel.findUserByEmail(email);
  if (existingUser) {
    const error = new Error('E-Mail already exists.');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.createUser({
    username,
    email,
    password: hashedPassword,
  });

  const accessToken = generateAccessToken({
    userId: user.id,
    username: user.username,
  });
  const refreshToken = generateRefreshToken({
    userId: user.id,
    username: user.username,
  });

  await tokenModel.storeToken(user.id, refreshToken);

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, tokens: { accessToken, refreshToken } };
};

const loginUser = async ({ username, password }) => {
  const user = await userModel.findUserByUsername(username);

  if (!user) {
    const error = new Error('Invalid credentials.');
    error.statusCode = 401;
    throw error;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    const error = new Error('Invalid credentials.');
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    username: user.username,
  });
  const refreshToken = generateRefreshToken({
    userId: user.id,
    username: user.username,
  });

  await tokenModel.storeToken(user.id, refreshToken);

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, tokens: { accessToken, refreshToken } };
};

const logoutUser = async (refreshToken) => {
  await tokenModel.deleteToken(refreshToken);
};

const logOutAllSessions = async (userId) => {
  await tokenModel.deleteAllUserTokens(userId);
};

const refreshAccessToken = async (refreshToken) => {
  await tokenModel.isTokenValid(refreshToken);

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  const accessToken = generateAccessToken({
    userId: decoded.userId,
    username: decoded.username,
  });

  const { password, ...userWithoutPassword } = await userModel.findUserById(
    decoded.userId
  );

  return { accessToken, user: userWithoutPassword };
};

export {
  registerUser,
  loginUser,
  logoutUser,
  logOutAllSessions,
  refreshAccessToken,
};
