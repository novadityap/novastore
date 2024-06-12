import dbConnect from '../config/dbConnect.js';
import userSeeder from '../seeders/userSeeder.js';
import mongoose from 'mongoose';
import logger from '../config/logger.js';

const seed = async () => {
  try {
    await dbConnect();
    await userSeeder();
    await mongoose.disconnect();

    logger.info('Database seeded successfully');
  } catch(err) {
    logger.error(err);
  }
}

seed();
