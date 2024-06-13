import Brand from '../models/brandModel.js';
import isValidObjectId from '../utils/isValidObjectId.js';
import ResponseError from '../error/responseError.js';
import validate from '../validations/validate.js';
import {brandSchema} from '../validations/brandValidation.js';

const createBrand = async (req, res, next) => {
  try {
    const value = validate(brandSchema, req.body);
    const brand = await Brand.create(value);

    return res.status(201).json({
      data: brand,
      message: 'Brand created successfully',
    });
  } catch(err) {
    next(err);
  }
};

const getAllBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find();
    return res.status(200).json({data: brands});
  } catch(err) {
    next(err);
  }
};

const getBrand = async (req, res, next) => {
  try {
    isValidObjectId(req.params.id); 

    const brand = await Brand.findById(req.params.id);
    if(!brand) throw new ResponseError(404, 'Brand not found');

    return res.status(200).json({data: brand});
  } catch(err) {
    next(err);
  }
};

const updateBrand = async (req, res, next) => {
  try {
    isValidObjectId(req.params.id);

    const value = validate(brandSchema, req.body);
    const brand = await Brand.findByIdAndUpdate(req.params.id, value, {new: true});
    if(!brand) throw new ResponseError(404, 'Brand not found');

    return res.status(200).json({
      data: brand,
      message: 'Brand updated successfully',
    });
  } catch(err) {
    next(err);
  }
};

const deleteBrand = async (req, res, next) => {
  try {
    isValidObjectId(req.params.id);

    const brand = await Brand.findByIdAndDelete(req.params.id);
    if(!brand) throw new ResponseError(404, 'Brand not found');
    
    return res.status(200).json({message: 'Brand deleted successfully'});
  } catch(err) {
    next(err);
  }
};

export {
  createBrand,
  getAllBrands,
  getBrand,
  updateBrand,
  deleteBrand,
}