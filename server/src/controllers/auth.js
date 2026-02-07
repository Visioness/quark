import { matchedData } from 'express-validator';
import * as authService from '../services/authService.js';

const signUp = async (req, res, next) => {
  if (req.user) {
    return res.redirect('/');
  }

  try {
    const { username, email, password } = matchedData(req);

    const result = await authService.registerUser({
      username,
      email,
      password,
    });

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: `Successfully registered as ${username}.`,
      user: result.user,
      accessToken: result.tokens.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const logIn = async (req, res, next) => {
  if (req.user) {
    return res.redirect('/');
  }

  try {
    const { username, password } = matchedData(req);

    const result = await authService.loginUser({
      username,
      password,
    });

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: `Successfully logged in as ${username}.`,
      user: result.user,
      accessToken: result.tokens.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const logOut = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized.',
    });
  }

  try {
    const refreshToken = req.cookies.refreshToken;

    await authService.logoutUser(refreshToken);

    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Successfully logged out.',
    });
  } catch (error) {
    next(error);
  }
};

const logOutAllSessions = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized.',
    });
  }

  try {
    await authService.logOutAllSessions(req.user.id);

    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Successfully logged out from all devices.',
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      const error = new Error('No refresh token provided.');
      error.statusCode = 401;
      throw error;
    }

    const result = await authService.refreshAccessToken(refreshToken);

    res.json({
      success: true,
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export { signUp, logIn, logOut, logOutAllSessions, refreshToken };
