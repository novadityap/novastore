import joi from 'joi';

const registerSchema = joi.object({
  firstname: joi.string().required(),
  lastname: joi.string().required(),
  email: joi.string().email().required(),
  mobile: joi.string().required(),
  password: joi.string().required()
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required()
});

export {registerSchema, loginSchema};