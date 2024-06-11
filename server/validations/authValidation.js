import joi from 'joi';

const forgotPasswordSchema = joi.object({
  email: joi.string().email().required()
});

const resetPasswordSchema = joi.object({
  password: joi.string().required(),
  confirmPassword: joi.string().required().valid(joi.ref('password'))
});

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

export {forgotPasswordSchema, resetPasswordSchema, registerSchema, loginSchema};