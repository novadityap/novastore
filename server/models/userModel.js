import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  }, 
  lastname: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  }, 
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  address: {
    type: String,
    required: true
  },
  cart: {
      type: Array,
      default: []
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpires: {
    type: Date,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordTokenExpires: {
    type: Date,
  },
  refreshToken: {
    type: String
  }
}, { 
  timestamps: true, 
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.verificationToken;
  delete user.verificationTokenExpires;
  delete user.resetPasswordToken;
  delete user.resetPasswordTokenExpires;
  delete user.refreshToken;
  delete user.createdAt;
  delete user.updatedAt;
  return user;
}

const User = mongoose.model('User', userSchema);

export default User;