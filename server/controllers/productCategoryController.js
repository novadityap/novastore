import ProductCategory from '../models/productCategoryModel.js';
import isValidObjectId from '../utils/isValidObjectId.js';
import ResponseError from '../error/responseError.js';
import validate from '../validations/validate.js';
import {categorySchema} from '../validations/productValidation.js';

const createCategory = async (req, res, next) => {
  try {
    const value = validate(categorySchema, req.body);
    const category = await ProductCategory.create(value);

    return res.status(201).json({
      data: category,
      message: 'Category created successfully',
    });
  } catch (err) { 
    next(err);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await ProductCategory.find();
    return res.status(200).json({data: categories});
  } catch (err) {
    next(err);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    isValidObjectId(req.params.id);

    const category = await ProductCategory.findById(req.params.id);
    if (!category) throw new ResponseError(404, 'Product category not found');

    return res.status(200).json({data: category});
  } catch (err) {
    next(err);
  }
};

const updateCategoryById = async (req, res, next) => {
  try {
    isValidObjectId(req.params.id);

    const value = validate(categorySchema, req.body);
    const category = await ProductCategory.findByIdAndUpdate(req.params.id, value, {
      new: true,
    });
    if (!category) throw new ResponseError(404, 'Product category not found');

    return res.status(200).json({
      data: category,
      message: 'Product category updated successfully',
    });
  } catch (err) {
    next(err);
  }
};

const deleteCategoryById = async (req, res, next) => {
  try {
    isValidObjectId(req.params.id);

    const category = await ProductCategory.findByIdAndDelete(req.params.id);
    if (!category) throw new ResponseError(404, 'Product category not found'); 

    return res.status(200).json({message: 'Product category deleted successfully'});
  } catch (err) {
    next(err);
  }
};

export {createCategory, getAllCategories, getCategoryById, updateCategoryById, deleteCategoryById};