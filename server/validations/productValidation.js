import joi from 'joi';

const categorySchema = joi.object({
  name: joi.string().required()
});

const productSchema = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
  price: joi.number().required(),
  category: joi.string().required(),
  brand: joi.string().required(),
  quantity: joi.number().required(),
  colors: joi.string().required(),
  tags: joi.string(),
})


export {categorySchema, productSchema};