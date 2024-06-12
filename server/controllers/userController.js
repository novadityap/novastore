import User from '../models/userModel.js';
import isValidObjectId from '../utils/isValidObjectId.js';
import ResponseError from '../error/responseError.js';
import validate from '../validations/validate.js';
import {updateUserSchema} from '../validations/userValidation.js';
import bcrypt from 'bcrypt';

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({role: 'user'});
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    isValidObjectId(req.params.id);

    const user = await User.findById(req.params.id);
    if(!user) throw new ResponseError(404, 'User not found');

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    isValidObjectId(req.params.id);
    
    const value = validate(updateUserSchema, req.body);
    value.password = await bcrypt.hash(value.password, 10);
    
    const user = await User.findByIdAndUpdate(req.params.id, value, {new: true});
    if(!user) throw new ResponseError(404, 'User not found');
    
    return res.status(200).json({
      data: user,
      message: 'User updated successfully',
    });
  } catch(err) {
    next(err);
  }
}

const deleteUserById = async (req, res, next) => {
  try {
    isValidObjectId(req.params.id);

    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({message: 'User deleted successfully'});
  } catch(err) {
    next(err);
  }
}

export {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
}