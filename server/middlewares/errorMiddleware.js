import ResponseError from '../error/responseError.js';
import logger from '../config/logger.js';
import jwt from 'jsonwebtoken';

const errorMiddleware = (err, req, res, next) => {
  let error;
  const isBadRequest = err.status === 400;
  const isJwtValid = err instanceof jwt.JsonWebTokenError;
  const isJwtExpired = err instanceof jwt.TokenExpiredError;

  if(err instanceof ResponseError && !isBadRequest) {
    logger.error(err);
    res.status(err.status).json({error: err.message});
  } else if(isJwtValid) {
    logger.error(err);
    res.status(401).json({error: 'Invalid token'})
  } else if(isJwtExpired) {
    logger.error(err);
    res.status(401).json({error: 'Token expired'});
  } else if(isBadRequest) {
    try {
      error = JSON.parse(err.message);
    } catch(e) {
      if(err.message === 'Invalid credentials') {
        error = [
          {credentials: err.message}
        ];
      } 
    }

    logger.error(err);
    res.status(400).json({error});
  } else {
    logger.error(err);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

export default errorMiddleware;