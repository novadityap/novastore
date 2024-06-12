import mongoose from 'mongoose';

const productCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  }
});

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);

export default ProductCategory;