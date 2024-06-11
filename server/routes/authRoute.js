import express from 'express';
import {emailVerification, register, login, logout} from '../controllers/authController.js';
import authenticateTokenMiddleware from '../middlewares/authenticateTokenMiddleware.js';

const router = express.Router();

router.get('/:id/email-verification/:token', emailVerification);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateTokenMiddleware, logout);

export default router;