import ResponseError from '../error/responseError.js';
import joi from 'joi';
import logger from '../config/logger.js';
import jwt from 'jsonwebtoken';

const errorMiddleware = (err, req, res, next) => {
  if(err instanceof ResponseError) {
    logger.error(err);

    if(err.message === 'Image is required') {
      const errors = {
        images: 'Image is required'
      };

      res.status(400).json({errors})
    }
    
    res.status(err.status).json({
      error: err.message
    });
  } else if(err instanceof jwt.JsonWebTokenError) {
    logger.error(err);
    res.status(401).json({
      error: 'Invalid token'
    })
  } else if(err instanceof jwt.TokenExpiredError) {
    logger.error(err);
    res.status(401).json({
      error: 'Token expired'
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
    logger.error(err);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

export default errorMiddleware;