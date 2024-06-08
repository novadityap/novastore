const validate = (schema, req) => {
  const result = schema.validate(req, {
    abortEarly: false,
    stripUnknown: true,
  })

  if(result.error) {
    throw result.error
  } 

  return result.value
}

export default validate