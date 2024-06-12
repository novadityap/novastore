import {createCategory, getAllCategories, getCategoryById, updateCategoryById, deleteCategoryById} from '../controllers/productCategoryController.js';
import express from 'express';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.use(adminAuthMiddleware);
router.post('/', createCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategoryById);
router.delete('/:id', deleteCategoryById);

export default router;
