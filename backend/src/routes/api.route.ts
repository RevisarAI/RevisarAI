import express from 'express';
import authMiddleware from '../common/auth.middleware';
import reviewRoute from './review.route';
import 'express-async-errors';

const router = express.Router();

router.use(authMiddleware);
router.use('/reviews', reviewRoute);

export default router;
