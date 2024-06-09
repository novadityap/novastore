import User from '../models/userModel.js';
import validate from '../validations/validate.js';
import {registerSchema} from '../validations/authValidation.js';
import sendMail from '../config/sendMail.js';
import ejs from 'ejs';
import jwt from 'jsonwebtoken';

const register = async (req, res, next) => {
  try {
    const value = validate(registerSchema, req.body);
    const userExists = await User.findOne({ email: value.email });
    
    if(!userExists) {
      const user = await User.create(value);
      const verificationToken = jwt.sign({id: user._id}, process.env.VERIFY_TOKEN_SECRET, {
        expiresIn: '1d'
      });
      const html = await ejs.renderFile('./views/emails/emailVerification.ejs', {
        user: user,
        token: verificationToken,
        url: process.env.CLIENT_URL
      });

      await sendMail(user.email, html);
    }

    return res.status(200).json({
      message: 'Please check your email to verify your account'
    });
  } catch(err) {
    next(err);
  } 
}

export {register};