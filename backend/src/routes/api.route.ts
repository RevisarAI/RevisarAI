import express from 'express';
import authMiddleware from '../common/auth.middleware';
import reviewRoute from './review.route';
import clientsRoute from './clients.route';
import 'express-async-errors';

const router = express.Router();

router.use(authMiddleware);
router.use('/reviews', reviewRoute);
router.use('/clients', clientsRoute);
router.use('/api-keys', clientsRoute);

export default router;
