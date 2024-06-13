import { Router } from 'express';
import ReviewsController from '../controllers/reviewsController';
import checkApiKey from '../common/apiKeyMiddleware';

const batchRouter = Router();

batchRouter.post('/', checkApiKey, ReviewsController.post.bind(ReviewsController));

export default batchRouter;