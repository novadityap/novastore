import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  sold: {
    type: Number,
    default: 0,
  },
  images: [
    {
      type: String,
      required: true
    }
  ],
  colors: [
    {
      type: String,
      required: true
    }
  ],
  tags: String,
  ratings: [
    {
      star: Number,
      comment: String,
      postedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      },
    },
  ],
  totalRating: {
    type: Number,
    default: 0,
  },
}, { 
  timestamps: true 
});

const Product = mongoose.model('Product', productSchema);

export default Product;
