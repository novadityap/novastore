import express from 'express';
import logger from './config/logger.js';
import dbConnect from './config/dbConnect.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import httpLoggerMiddleware from './middlewares/httpLoggerMiddleware.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import productCategoryRoute from './routes/productCategoryRoute.js';
import productRoute from './routes/productRoute.js';
import brandRoute from './routes/brandRoute.js';
import colorRoute from './routes/colorRoute.js';
import couponRoute from './routes/couponRoute.js';

const PORT = process.env.PORT || 3000;
const app = express();

dbConnect();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(httpLoggerMiddleware);

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/product-categories', productCategoryRoute);
app.use('/api/products', productRoute);
app.use('/api/brands', brandRoute);
app.use('/api/colors', colorRoute);
app.use('/api/coupons', couponRoute);

app.use(errorMiddleware);

app.listen(3000, () => {
  logger.info(`Server listening on port ${PORT}`);
});