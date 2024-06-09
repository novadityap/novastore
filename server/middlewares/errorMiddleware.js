import ResponseError from '../error/responseError.js';
import joi from 'joi';
import logger from '../config/logger.js';
import jwt from 'jsonwebtoken';


const errorMiddleware = (err, req, res, next) => {
  if(err instanceof ResponseError) {
    logger.error(err);
    res.status(err.status).json({
      errors: err.message
    });
  } else if(err instanceof jwt.JsonWebTokenError) {
    logger.error(err);
    res.status(401).json({
      errors: 'Invalid token'
    })
  } else if(err instanceof jwt.TokenExpiredError) {
    logger.error(err);
    res.status(401).json({
      errors: 'Token expired'
    })
  } else if(err instanceof joi.ValidationError) {
    const errors = err.details.map(detail => (
      {[detail.context.label]: detail.message.replace(/"/g, '')}
    ))
    logger.error(err);
    res.status(400).json({
      errors: errors
    });
  } else {
    console.log(err);
    logger.error(err);
    res.status(500).json({
      errors: 'Something went wrong',
    });
  }
}

export default errorMiddleware;