import jwt from 'jsonwebtoken';

const generateRefreshToken = (userId) => {
  return jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES
  });
}

export default generateRefreshToken;