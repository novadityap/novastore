import {createProduct, getAllProducts, getProductById, updateProductById, deleteProductById} from '../controllers/productController.js';
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';
import imageUploadMiddleware from '../middlewares/imageUploadMiddleware.js';

const router = express.Router();

router.post('/', imageUploadMiddleware.array('images'), authMiddleware, adminAuthMiddleware, createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', imageUploadMiddleware.array('images'), authMiddleware, adminAuthMiddleware, updateProductById);
router.delete('/:id', authMiddleware, adminAuthMiddleware, deleteProductById);

export default router;