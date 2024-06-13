import joi from 'joi';

const couponSchema = joi.object({
  code: joi.string().required(),
  discount: joi.number().required(),
  expires: joi.date().required() 
});

export {couponSchema};