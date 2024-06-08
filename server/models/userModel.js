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
    required: true
  }, 
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    required: true
  }
}, { timestamps: true });

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