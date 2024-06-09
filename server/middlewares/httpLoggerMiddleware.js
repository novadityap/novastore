import logger from '../config/logger.js';

const httpLoggerMiddleware = (req, res, next) => {
  const httpRequest = {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    headers: req.headers
  };
  
  logger.info('HTTP Request', { request: httpRequest });
  next();
}

export default httpLoggerMiddleware;