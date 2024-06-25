import { IBatchReview } from 'shared-types';
import { Request, Response } from 'express';
import ReviewsProducer from '../producer';

class BatchController {
  private reviewsProducer: ReviewsProducer;

  constructor() {
    this.reviewsProducer = new ReviewsProducer();
  }

  post = async (req: Request, res: Response) => {
    let { reviews } = req.body;
    const { businessId } = req.body;

    reviews = reviews.map((review: IBatchReview) => ({ ...review, businessId, dataSource: 'API' }));
    try {
      this.reviewsProducer.produce(reviews);
      res.status(201).send();
    } catch (err) {
      res.status(500).send();
    }
  };
}

export default new BatchController();
