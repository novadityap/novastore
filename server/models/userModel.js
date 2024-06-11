import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpires: {
    type: Date,
  }
}, { timestamps: true, });

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.isVerified;
  delete user.verificationToken;
  delete user.createdAt;
  delete user.updatedAt;
  return user;
}

userSchema.pre('save', async function (next)  {
  if(!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch(err) {
    next(err);
  }
})

const User = mongoose.model('User', userSchema);

export default User;