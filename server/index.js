import express from 'express';
import logger from './config/logger.js';
import dbConnect from './config/dbConnect.js';

const PORT = process.env.PORT || 3000;
const app = express();

dbConnect();

app.listen(3000, () => {
  logger.info(`Server listening on port ${PORT}`);
});