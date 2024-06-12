import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  }, 
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
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
  isBlocked: {
    type: Boolean,
    default: false
  },
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
  delete user.createdAt;
  delete user.updatedAt;
  return user;
}

const User = mongoose.model('User', userSchema);

export default User;