import User from '../models/userModel.js';
import validate from '../validations/validate.js';
import { registerSchema } from '../validations/authValidation.js';
import sendMail from '../config/sendMail.js';
import ejs from 'ejs';

const register = async (req, res, next) => {
  try {
    let user = validate(registerSchema, req.body);
    user = await User.create(user);
    const html = await ejs.renderFile('./views/emails/emailVerification.ejs', {
      user: user,
      url: process.env.CLIENT_URL
    });
    
    await sendMail(user.email, html);

    return res.status(200).json({
      message: 'Please check your email to verify your account'
    });
  } catch(err) {
    next(err);
  } 
}

export {register};