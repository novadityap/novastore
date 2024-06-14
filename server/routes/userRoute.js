import {getAllUsers, getUserById, updateUserById, deleteUserById} from '../controllers/userController.js';
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(adminAuthMiddleware);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);

export default router;