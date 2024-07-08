import { IBatchReview, DataSourceEnum } from 'shared-types';
import { Response } from 'express';
import ReviewsProducer from '../producer';
import { ApiKeyRequest } from 'common/api-key.middleware';
import httpStatus from 'http-status';
import { createLogger } from 'revisar-server-utils';

const logger = createLogger('BatchController');

class BatchController {
  private reviewsProducer: ReviewsProducer;

  constructor() {
    this.reviewsProducer = new ReviewsProducer();
  }

  post = async (req: ApiKeyRequest<object, void, IBatchReview[]>, res: Response) => {
    const { businessId, body: reviews } = req;

    const mappedReviews = reviews.map((review: IBatchReview) => ({
      ...review,
      businessId,
      dataSource: DataSourceEnum.API,
    }));

    logger.debug(`Received ${mappedReviews.length} reviews for business ${businessId}`);

    try {
      await this.reviewsProducer.produce(mappedReviews);
      logger.debug(`Successfully produced ${mappedReviews.length} reviews for business ${businessId}`);
      return res.sendStatus(httpStatus.CREATED);
    } catch (err) {
      logger.error(
        `Error producing reviews for business ${businessId}`,
        (err as Error).message,
        (err as Error).stack || 'no stacktrace'
      );
      return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
  };
}

export default new BatchController();
