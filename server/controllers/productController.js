import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import validate from '../validations/validate.js';
import {productSchema} from '../validations/productValidation.js';
import ResponseError from '../error/responseError.js';
import isValidObjectId from '../utils/isValidObjectId.js';
import slugify from 'slugify';

const createProduct = async (req, res, next) => {
  try {
    const value = validate(productSchema, req.body);

    if(!req.files.length) throw new ResponseError(400, 'Image is required');

    const images = req.files.map((file) => file.path);
    value.images = images;
    value.slug = slugify(value.name);

    const product = await Product.create(value); 

    return res.status(201).json({
      data: product,
      message: 'Product created successfully',
    });
  } catch (err) { 
    next(err);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    return res.status(200).json({data: products});
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    isValidObjectId(req.params.id);

    const product = await Product.findById(req.params.id);
    if (!product) throw new ResponseError(404, 'Product not found');

    return res.status(200).json({data: product});
  } catch (err) {
    next(err);
  }
};

const updateProductById = async (req, res, next) => {
  try {
    isValidObjectId(req.params.id);
    const value = validate(productSchema, req.body);

    if(!req.files.length) throw new ResponseError(400, 'Image is required');
    
    const images = req.files.map((file) => file.path);
    value.images = images;
    value.slug = slugify(value.name);

    const product = await Product.findByIdAndUpdate(req.params.id, value, {
      new: true,
    });
    if (!product) throw new ResponseError(404, 'Product not found');

    return res.status(200).json({
      data: product,
      message: 'Product updated successfully',
    });
  } catch (err) {
    next(err);
  }
};

const deleteProductById = async (req, res, next) => {
  try {
    isValidObjectId(req.params.id);

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new ResponseError(404, 'Product not found');

    return res.status(200).json({message: 'Product deleted successfully'});
  } catch (err) {
    next(err);
  }
};

const addToWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    const product = await Product.findById(req.params.id);
    if (!product) throw new ResponseError(404, 'Product not found');

    const isAlreadyAdded = user.wishlist.includes(product._id);
    if (isAlreadyAdded) throw new ResponseError(400, 'Product already added to wishlist')

    user.wishlist.push(product._id);
    await user.save();

    return res.status(200).json({
      data: user.wishlist,
      message: 'Product added to wishlist'
    });
  } catch (err) {
    next(err);
  }
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  addToWishlist
};