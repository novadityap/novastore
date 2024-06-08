import mongoose from 'mongoose';
import logger from './logger.js';

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB connected successfully');
  } catch(err) {
    logger.error(err);
  }
}

export default dbConnect;