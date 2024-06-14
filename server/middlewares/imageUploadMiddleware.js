import multer from 'multer';
import ResponseError from '../error/responseError.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ResponseError(400, 'File must be an image'), false);
  }
};


const imageUploadMiddleware = multer({ 
  storage, 
  
  limits: { fileSize: 1024 * 1024 * 100 },
});

export default imageUploadMiddleware;