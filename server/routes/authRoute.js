import express from 'express';
import {emailVerification, resendEmailVerification, register, login, logout, forgotPassword, resetPassword} from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/email-verification/:token', emailVerification);
router.post('/resend-email-verification', resendEmailVerification);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);

export default router;