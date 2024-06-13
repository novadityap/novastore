import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  expires: {
    type: Date,
    required: true
  }
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon