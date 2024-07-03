import express from 'express';
import authMiddleware from '../common/auth.middleware';
import reviewRoute from './review.route';
import 'express-async-errors';
import actionItemsRouter from './action-items';

const router = express.Router();

router.use(authMiddleware);
router.use('/reviews', reviewRoute);
router.use('/action-items', actionItemsRouter);

export default router;
