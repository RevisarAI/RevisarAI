import { Router } from 'express';
import ReviewsController from '../controllers/reviewsController';
import checkApiKey from '../common/apiKeyMiddleware';

const reviewsRouter = Router();

reviewsRouter.post('/', checkApiKey, ReviewsController.post.bind(ReviewsController));

export default reviewsRouter;