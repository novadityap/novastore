import express from 'express';
import logger from './config/logger.js';
import dbConnect from './config/dbConnect.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import httpLoggerMiddleware from './middlewares/httpLoggerMiddleware.js';
import authRoute from './routes/authRoute.js';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 3000;
const app = express();

dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(httpLoggerMiddleware);

app.use('/api/auth', authRoute);

app.use(errorMiddleware);

app.listen(3000, () => {
  logger.info(`Server listening on port ${PORT}`);
});