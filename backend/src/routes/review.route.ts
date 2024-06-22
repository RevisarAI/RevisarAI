import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import 'express-async-errors';

const router = Router();

router.get('/analysis', reviewController.getAnalysis.bind(reviewController));

export default router;
