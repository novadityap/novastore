import mongoose from 'mongoose';
import ResponseError from '../error/responseError.js';
const isValidObjectId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if(!isValid) throw new ResponseError(400, 'Invalid ObjectId');

  return isValid;
}

export default isValidObjectId;