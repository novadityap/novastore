import  joi from 'joi';

const brandSchema = joi.object({
  name: joi.string().required()
});

export {brandSchema};