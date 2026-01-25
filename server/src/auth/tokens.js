import jwt from 'jsonwebtoken';

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET, {
    expiresIn: '15m',
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

export { generateAccessToken, generateRefreshToken };
