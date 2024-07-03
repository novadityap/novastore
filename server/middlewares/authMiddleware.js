import jwt from 'jsonwebtoken';
import ResponseError from '../error/responseError.js';
import Blacklist from '../models/blacklistModel.js';

const authMiddleware = async (req, res, next) => {
  try {
    const {accessToken} = req.cookies;
    if(!accessToken) throw new ResponseError(401, 'Unauthorized access');
    
    const blacklistedToken = await Blacklist.findOne({token: accessToken});
    if(blacklistedToken) throw new ResponseError(401, 'Unauthorized access');
    
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;

    next();
  } catch(err) {
    next(err);
  }
}

export default authMiddleware;