import express from 'express';
import { authMiddleware } from 'revisar-server-utils';
import 'express-async-errors';
import config from '../config';
import reviewRoute from './review.route';
import clientsRoute from './clients.route';
import actionItemsRouter from './action-items.route';
import apiKeyRouter from './api-key.router';

const router = express.Router();

router.use(authMiddleware(config.accessTokenSecret));
router.use('/reviews', reviewRoute);
router.use('/api-keys', apiKeyRouter);
router.use('/action-items', actionItemsRouter);
router.use('/clients', clientsRoute);

export default router;
