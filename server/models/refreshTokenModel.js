import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  expires: {
    type: Date,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;