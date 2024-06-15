import joi from 'joi';

const forgotPasswordSchema = joi.object({
  email: joi.string().email().required()
});

const resetPasswordSchema = joi.object({
  password: joi.string().min(3).required(),
  confirmPassword: joi.any().equal(joi.ref('password'))
  .required()
  .label('Confirm password')
  .messages({ 'any.only': '{{#label}} does not match' })
});

const registerSchema = joi.object({
  firstname: joi.string().required(),
  lastname: joi.string().required(),
  email: joi.string().email().required(),
  mobile: joi.string().required(),
  password: joi.string().min(3).required()
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(3).required()
});

export {forgotPasswordSchema, resetPasswordSchema, registerSchema, loginSchema};