import express from 'express';
import {emailVerification, register, login, logout, forgotPassword, resetPassword} from '../controllers/authController.js';
import authenticateTokenMiddleware from '../middlewares/authenticateTokenMiddleware.js';

const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/email-verification/:token', emailVerification);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateTokenMiddleware, logout);

export default router;