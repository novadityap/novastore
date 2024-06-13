import joi from 'joi';

const colorSchema = joi.object({
  name: joi.string().required()
});

export {colorSchema};