import express from 'express';
import logger from './config/logger.js';

const PORT = process.env.PORT || 3000;
const app = express();

app.listen(3000, () => {
  logger.info(`Server listening on port ${PORT}`);
});