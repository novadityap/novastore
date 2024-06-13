import {createCoupon, getAllCoupons, getCouponById, updateCouponById, deleteCouponById} from '../controllers/couponController.js';
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(adminAuthMiddleware);

router.post('/', createCoupon);
router.get('/', getAllCoupons);
router.get('/:id', getCouponById);
router.put('/:id', updateCouponById);
router.delete('/:id', deleteCouponById);

export default router;