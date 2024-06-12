import User from '../models/userModel.js';
const adminAuthMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if(user.role !== 'admin') return res.status(403).json({message: 'Forbidden access'});

    next();
  } catch(err) {
    next(err);
  }
}

export default adminAuthMiddleware;