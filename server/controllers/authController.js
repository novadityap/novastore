import User from '../models/userModel.js';
import Blacklist from '../models/blacklistModel.js';
import validate from '../validations/validate.js';
import {
  forgotPasswordSchema, 
  resetPasswordSchema, 
  resendEmailVerificationSchema,
  registerSchema, 
  loginSchema
} from '../validations/authValidation.js';
import generateAccessToken from '../utils/generateAccessToken.js';
import generateRefreshToken from '../utils/generateRefreshToken.js';
import sendMail from '../config/sendMail.js';
import ejs from 'ejs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ResponseError from '../error/responseError.js';
import crypto from 'crypto';

const refreshToken = async (req, res, next) => {
  try {
    const {refreshToken} = req.cookies;
    
    const user = await User.findOne({refreshToken});
    if(!user) throw new ResponseError(401, 'Unauthorized access, token not provided');
    
    const accessToken = generateAccessToken(user._id);

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 15 * 1000
    });
     
    res.sendStatus(200);
  } catch(err) {
    next(err);
  }
}

const forgotPassword = async (req, res, next) => {
  try {
    const value = validate(forgotPasswordSchema, req.body);
    
    const user = await User.findOneAndUpdate(
      {email: value.email},
      {
        resetPasswordToken: crypto.randomBytes(32).toString('hex'),
        resetPasswordTokenExpires: Date.now() + 60 * 60 * 1000
      },
      {new: true}
    );

    if(!user) {
      return res.status(200).json({
        message: 'Please check your email to reset your password'
      });
    };

    const html = await ejs.renderFile('./views/emails/forgotPassword.ejs', {
      user: user,
      url: process.env.CLIENT_URL
    });

    await sendMail(user.email, 'Reset Password', html);
    
    res.status(200).json({
      message: 'Please check your email to reset your password'
    });
  } catch(err) {
    next(err);
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const {token} = req.params;
    const {confirmPassword} = validate(resetPasswordSchema, req.body);

    const user = await User.findOneAndUpdate(
      {
        resetPasswordToken: token,
        resetPasswordTokenExpires: {$gt: Date.now()}
      },
      {
        password: await bcrypt.hash(confirmPassword, 10),
        resetPasswordToken: null,
        resetPasswordTokenExpires: null
      },
      {new: true}
    );

    if(!user) throw new ResponseError(401, 'Password reset token is invalid or has expired');
    
    res.status(200).json({
      message: 'Password reset successfully'
    });
  } catch(err) {
    next(err);
  }
}

const emailVerification = async (req, res, next) => {
  try {
    const {token} = req.params;

    const user = await User.findOneAndUpdate(
      { 
        verificationToken: token, 
        verificationTokenExpires: {$gt: Date.now()} 
      },
      {
        verificationToken: null,
        verificationTokenExpires: null,
        isVerified: true
      },
      {new: true}
    );

    if(!user) throw new ResponseError(401, 'Verification token is invalid or has expired');

    res.status(200).json({
      message: 'Your email has been verified successfully, you can now login'
    });
  } catch(err) {
    next(err);
  }
}

const resendEmailVerification = async (req, res, next) => {
  try {
    const value = validate(resendEmailVerificationSchema, req.body);

    const user = await User.findOne({email: value.email});
    if(!user) throw new ResponseError(404, 'Your email is not registered');

    user.verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const html = await ejs.renderFile('./views/emails/emailVerification.ejs', {
      user: user,
      url: process.env.CLIENT_URL
    });

    await sendMail(user.email, 'Email Verification', html);
    
    res.status(200).json({
      message: 'Please check your email to verify your account'
    });
  } catch(err) {
    next(err);
  }
}

const register = async (req, res, next) => {
  try {
    const value = validate(registerSchema, req.body);
    let user = await User.findOne({ email: value.email });

    if(!user) {
      value.password = await bcrypt.hash(value.password, 10);
      user = await User.create({
        ...value,
        verificationToken: crypto.randomBytes(32).toString('hex'),
        verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000
      });

      const html = await ejs.renderFile('./views/emails/emailVerification.ejs', {
        user: user,
        url: process.env.CLIENT_URL
      });

      await sendMail(user.email, 'Email Verification', html);
    }

    res.status(200).json({
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

    if(!user || !(await bcrypt.compare(value.password, user.password))) throw new ResponseError(400, 'Invalid credentials');

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();
    
    res.status(200)
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 15 * 1000
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
    const {accessToken} = req.cookies;
    
    await User.findOneAndUpdate({
      _id: req.user.userId
    }, {
      refreshToken: null
    });

    await Blacklist.create({token: accessToken});

    res.status(200)
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .json({message: 'Logout successfully'});
  } catch(err) {
    next(err);
  }
}

export {
  refreshToken,
  forgotPassword,
  resetPassword,
  emailVerification,
  resendEmailVerification,
  register,
  login,
  logout
};