import Color from '../models/colorModel.js';
import ResponseError from '../error/responseError.js';
import isValidObjectId from '../utils/isValidObjectId.js';
import validate from '../validations/validate.js';
import {colorSchema} from '../validations/colorValidation.js';

const createColor = async (req, res, next) => {
  try {
    const value = validate(colorSchema, req.body);
    const color = await Color.create(value);
    return res.status(201).json({
      data: color,
      message: 'Color created successfully',
    });
  } catch(err) {
    next(err);
  }
};

const getAllColors = async (req, res, next) => {
  try {
    const colors = await Color.find();
    return res.status(200).json({data: colors});
  } catch(err) {
    next(err);
  }
};

const getColorById = async (req, res, next) => {
  try {
    isValidObjectId(req.params.id);

    const color = await Color.findById(req.params.id);
    if (!color) throw new ResponseError(404, 'Color not found');

    return res.status(200).json({data: color});
  } catch(err) {
    next(err);  
  }
};

const updateColorById = async (req, res, next) => {
  try {
    isValidObjectId(req.params.id);

    const value = validate(colorSchema, req.body);
    const color = await Color.findByIdAndUpdate(req.params.id, value, {
      new: true,
    });
    if (!color) throw new ResponseError(404, 'Color not found');

    return res.status(200).json({
      data: color,
      message: 'Color updated successfully',
    });
  } catch(err) {
    next(err);
  }
};

const deleteColorById = async (req, res, next) => {
  try {
    isValidObjectId(req.params.id);

    const color = await Color.findByIdAndDelete(req.params.id);
    if (!color) throw new ResponseError(404, 'Color not found');

    return res.status(200).json({message: 'Color deleted successfully'});
  } catch(err) {
    next(err);
  }
};

export {
  createColor,
  getAllColors,
  getColorById,
  updateColorById,
  deleteColorById,
};

