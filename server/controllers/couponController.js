import Coupon from '../models/couponModel.js';
import ResponseError from '../error/responseError.js';
import isValidObjectId from '../utils/isValidObjectId.js';
import validate from '../validations/validate.js';
import {couponSchema} from '../validations/couponValidation.js';


const createCoupon = async (req, res, next) => {
  try {
    const value = validate(couponSchema, req.body);
    const coupon = await Coupon.create(value);

    return res.status(201).json({
      data: coupon,
      message: 'Coupon created successfully',
    });
  } catch(err) {
    next(err);
  }
};

const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    return res.status(200).json({data: coupons});
  } catch(err) {
    next(err);
  }
};

const getCouponById = async (req, res, next) => {
  try {
    isValidObjectId(req.params.id);

    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) throw new ResponseError(404, 'Coupon not found');

    return res.status(200).json({data: coupon});
  } catch(err) {
    next(err);
  }
};

const updateCouponById = async (req, res, next) => {
  try {
    isValidObjectId(req.params.id);

    const value = validate(couponSchema, req.body);
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, value, {
      new: true
    });
    if(!coupon) throw new ResponseError(404, 'Coupon not found');

    return res.status(200).json({
      data: coupon,
      message: 'Coupon updated successfully',
    });
  } catch(err) {
    next(err);
  }
};

const deleteCouponById = async (req, res, next) => {
  try {
    isValidObjectId(req.params.id);

    await Coupon.findByIdAndDelete(req.params.id);
    return res.status(200).json({message: 'Coupon deleted successfully'});
  } catch(err) {
    next(err);
  }
};

export {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCouponById,
  deleteCouponById
};
    