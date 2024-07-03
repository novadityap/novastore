import ResponseError from '../error/responseError.js'

const validate = (schema, body, files = null) => {
  let error = [];
  const result = schema.validate(body, {
    abortEarly: false,
    stripUnknown: true,
  })

  if(result.error) {
    error = result.error.details.map(detail => (
      {[detail.context.label]: detail.message.replace(/"/g, '')}
    ));
  } 

  if(files !== null) if(files.length === 0) error.push({images: 'Images is required'});

  if(error.length > 0) throw new ResponseError(400, JSON.stringify(error));

  return result.value
}

export default validate