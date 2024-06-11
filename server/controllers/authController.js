import User from '../models/userModel.js';
import RefreshToken from '../models/refreshTokenModel.js';
import Blacklist from '../models/blacklistModel.js';
import validate from '../validations/validate.js';
import {registerSchema, loginSchema} from '../validations/authValidation.js';
import sendMail from '../config/sendMail.js';
import ejs from 'ejs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ResponseError from '../error/responseError.js';

const emailVerification = async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.VERIFY_TOKEN_SECRET)
    const user = await User.findOne({ _id: decoded.id });

    await user.updateOne({isVerified: true});

    return res.status(200).json({
      message: 'Email verified successfully'
    });
  } catch(err) {
    next(err);
  }
}

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

const login = async (req, res, next) => {
  try {
    const value = validate(loginSchema, req.body);

    const user = await User.findOne({ email: value.email }).select('+password');
    if(!user) throw new ResponseError(400, 'Invalid credentials');

    const isPasswordValid = await bcrypt.compare(value.password, user.password);
    if(!isPasswordValid) throw new ResponseError(400, 'Invalid credentials');

    const accessToken = jwt.sign({id: user._id}, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m'
    });
    const refreshToken = jwt.sign({id: user._id}, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d'
    });

    await RefreshToken.create({
      token: refreshToken,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      userId: user._id
    });

    return res.status(200)
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      })
      .json({
        data: user,
        message: 'Login successfully'
      });
  } catch(err) {
    next(err);
  }
}

const logout = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const userId = req.user.id;

    await RefreshToken.deleteMany({userId});
    await Blacklist.create({token: accessToken});

    return res.status(200)
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .json({
        message: 'Logout successfully'
      });
  } catch(err) {
    next(err);
  }
}

export {
  emailVerification,
  register,
  login,
  logout
};