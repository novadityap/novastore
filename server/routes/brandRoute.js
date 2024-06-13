import {createBrand, getAllBrands, getBrand, updateBrand, deleteBrand} from '../controllers/brandController.js';
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, adminAuthMiddleware, createBrand);
router.get('/', getAllBrands);
router.get('/:id', getBrand);
router.put('/:id', authMiddleware, adminAuthMiddleware, updateBrand);
router.delete('/:id', authMiddleware, adminAuthMiddleware, deleteBrand);

export default router;