import jwt from 'jsonwebtoken';

const generateAccessToken = (userId) => {
  return jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES)
  });
}

export default generateAccessToken;