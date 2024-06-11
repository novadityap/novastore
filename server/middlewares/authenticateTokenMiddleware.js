import jwt from 'jsonwebtoken';
import ResponseError from '../error/responseError.js';

const authenticateTokenMiddleware = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if(!accessToken) throw new ResponseError(401, 'Unauthorized');

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;

    next();
  } catch(err) {
    next(err);
  }
}

export default authenticateTokenMiddleware;