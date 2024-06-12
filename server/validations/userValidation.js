import joi from 'joi';

const updateUserSchema = joi.object({
  firstname: joi.string().required(),
  lastname: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  mobile: joi.string().required(),
  address: joi.string().required()
});

export {updateUserSchema};