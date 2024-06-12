import User from '../models/userModel.js';
import RefreshToken from '../models/refreshTokenModel.js';
import Blacklist from '../models/blacklistModel.js';
import validate from '../validations/validate.js';
import {forgotPasswordSchema, resetPasswordSchema, registerSchema, loginSchema} from '../validations/authValidation.js';
import sendMail from '../config/sendMail.js';
import ejs from 'ejs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ResponseError from '../error/responseError.js';
import crypto from 'crypto';

const forgotPassword = async (req, res, next) => {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 60 * 60 * 1000;
    const subject = 'Reset Password';
    const value = validate(forgotPasswordSchema, req.body);
    
    const user = await User.findOne({email: value.email});
    if(!user) throw new ResponseError(404, 'The email you entered is incorrect');

    user.resetPasswordToken = token;
    user.resetPasswordTokenExpires = expires;
    await user.save();
    
    const html = await ejs.renderFile('./views/emails/forgotPassword.ejs', {
      user: user,
      url: process.env.CLIENT_URL
    });

    await sendMail(user.email, subject, html);
    
    return res.status(200).json({
      message: 'Please check your email to reset your password'
    });
  } catch(err) {
    next(err);
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = req.params.token;
    if(!resetPasswordToken) throw new ResponseError(401, 'Password reset token is invalid or has expired');
    
    const user = await User.findOne({resetPasswordToken})
    if(!user) throw new ResponseError(401, 'Password reset token is invalid or has expired');

    if(resetPasswordToken !== user.resetPasswordToken) throw new ResponseError(401, 'Password reset token is invalid');
    
    const isExpired = Date.now() > user.resetPasswordTokenExpires
    if(isExpired) throw new ResponseError(401, 'Password reset token expired');

    const {confirmPassword} = validate(resetPasswordSchema, req.body);
    
    user.password = confirmPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpires = null;
    await user.save();
    
    return res.status(200).json({
      message: 'Password reset successfully'
    });
  } catch(err) {
    next(err);
  }
}

const emailVerification = async (req, res, next) => {
  try {
    const verificationToken = req.params.token;
    if(!verificationToken) throw new ResponseError(401, 'Verification token is invalid or has expired');
    
    const user = await User.findOne({verificationToken});
    if(!user) throw new ResponseError(404, 'User not found');

    if(verificationToken !== user.verificationToken) throw new ResponseError(401, 'Verification token is invalid');

    const isExpired = Date.now() > user.verificationTokenExpires
    if(isExpired) throw new ResponseError(401, 'Verification token expired');

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    return res.status(200).json({
      message: 'Email verified successfully'
    });
  } catch(err) {
    next(err);
  }
}

const register = async (req, res, next) => {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 24 * 60 * 60 * 1000;
    const subject = 'Email Verification';
    const value = validate(registerSchema, req.body);
    const user = await User.findOne({ email: value.email });

    if(!user) {
      value.password = await bcrypt.hash(value.password, 10);
      user = await User.create({
        ...value,
        verificationToken: token,
        verificationTokenExpires: expires
      });

      const html = await ejs.renderFile('./views/emails/emailVerification.ejs', {
        user: user,
        url: process.env.CLIENT_URL
      });

      await sendMail(user.email, subject, html);
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

    const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m'
    });
    const refreshToken = jwt.sign({UserId: user._id}, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d'
    });

    await RefreshToken.create({
      token: refreshToken,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      user: user._id
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
        accessToken: accessToken,
        message: 'Login successfully'
      });
  } catch(err) {
    next(err);
  }
}

const logout = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    await RefreshToken.deleteMany({user: req.user.userId});
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
  forgotPassword,
  resetPassword,
  emailVerification,
  register,
  login,
  logout
};