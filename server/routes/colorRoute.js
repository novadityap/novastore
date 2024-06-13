import {createColor, getAllColors, getColorById, updateColorById, deleteColorById} from '../controllers/colorController.js';
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, adminAuthMiddleware, createColor);
router.get('/', getAllColors);
router.get('/:id', getColorById);
router.put('/:id', authMiddleware, adminAuthMiddleware, updateColorById);
router.delete('/:id', authMiddleware, adminAuthMiddleware, deleteColorById);

export default router;