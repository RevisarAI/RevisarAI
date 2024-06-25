import { IBatchReview } from 'shared-types';
import reviewsModel from '../models/review.model';
import { Request, Response } from 'express';

class BatchController {
  post = async (req: Request, res: Response) => {
    let { reviews } = req.body;
    const { businessId } = req.body;

    reviews = reviews.map((review: IBatchReview) => ({ ...review, businessId }));
    try {
      await reviewsModel.insertMany(reviews);
      res.status(201).send();
    } catch (err) {
      res.status(500).send();
    }
  };
}

export default new BatchController();
