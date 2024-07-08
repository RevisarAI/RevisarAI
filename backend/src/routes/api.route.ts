import express from 'express';
import authMiddleware from '../common/auth.middleware';
import reviewRoute from './review.route';
import clientsRoute from './clients.route';
import 'express-async-errors';
import actionItemsRouter from './action-items';

const router = express.Router();

router.use(authMiddleware);
router.use('/reviews', reviewRoute);
router.use('/api-keys', clientsRoute);
router.use('/action-items', actionItemsRouter);
router.use('/clients', clientsRoute);

export default router;
