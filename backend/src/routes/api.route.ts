import express from 'express';
import { authMiddleware } from 'revisar-server-utils';
import reviewRoute from './review.route';
import clientsRoute from './clients.route';
import 'express-async-errors';
import actionItemsRouter from './action-items';
import config from '../config';

const router = express.Router();

router.use(authMiddleware(config.accessTokenSecret));
router.use('/reviews', reviewRoute);
router.use('/api-keys', clientsRoute);
router.use('/action-items', actionItemsRouter);
router.use('/clients', clientsRoute);

export default router;
