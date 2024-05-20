import { Router } from 'express';
import ReviewsController from '../controllers/reviewsController';

const reviewsRouter = Router();

reviewsRouter.post('/',  ReviewsController.post.bind(ReviewsController));
reviewsRouter.post('/batch',  ReviewsController.postBatch.bind(ReviewsController));

export default reviewsRouter;