import User from '../models/userModel.js';
import logger from '../config/logger.js';
import bcrypt from 'bcrypt';

const userSeeder = async () => {
  try {
    await User.deleteMany({});

    await User.insertMany([
      {
        firstname: 'admin',
        lastname: 'novastore',
        email: 'admin@email.com',
        password: await bcrypt.hash('admin123', 10),
        phone: '08945237890',
        address: 'Kota Jember',
        role: 'admin',
        isVerified: true
      },
      {
        firstname: 'aditya',
        lastname: 'wahyu',
        email: 'aditya@email.com',
        password: await bcrypt.hash('aditya123', 10),
        phone: '08994567890',
        address: 'Kota Kediri',
        role: 'user',
        isVerified: true
      },
      {
        firstname: 'nova',
        lastname: 'heru',
        email: 'nova@email.com',
        password: await bcrypt.hash('nova123', 10),
        phone: '08534567890',
        address: 'Kota Nganjuk',
        role: 'user',
        isVerified: true
      }
    ]);
  } catch(err) {
    logger.error(err);
  }
}

export default userSeeder;