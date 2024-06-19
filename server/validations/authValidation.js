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

const resendEmailVerificationSchema = joi.object({
  email: joi.string().email().required()
});

const registerSchema = joi.object({
  firstname: joi.string().required(),
  email: joi.string().email().required(),
  phone: joi.string().required(),
  password: joi.string().min(3).required(),
  address: joi.string().required()
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(3).required()
});

export {
  resendEmailVerificationSchema,
  forgotPasswordSchema, 
  resetPasswordSchema, 
  registerSchema, 
  loginSchema
};