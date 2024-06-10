import express from 'express';
import {emailVerification, register, login} from '../controllers/authController.js';

const router = express.Router();

router.get('/verify/:token', emailVerification);
router.post('/register', register);
router.post('/login', login);

export default router;