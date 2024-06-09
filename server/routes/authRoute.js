import express from 'express';
import {emailVerification, register} from '../controllers/authController.js';

const router = express.Router();

router.get('/verify/:token', emailVerification);
router.post('/register', register);

export default router;