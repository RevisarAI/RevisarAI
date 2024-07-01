import {
  IReview,
  ISentimentBarChartGroup,
  IWordFrequency,
  IPieChartData,
  IBusinessAnalysis,
  IGenerateReviewReply,
  IReviewReply,
  IGetReviewsParams,
  IGetAllReviewsResponse,
} from 'shared-types';
import ReviewModel from '../models/review.model';
import { BaseController } from './base.controller';
import { AuthRequest } from 'common/auth.middleware';
import httpStatus from 'http-status';
import { Response } from 'express';
import { daysAgo } from '../utils/date';
import createLogger from 'revisar-server-utils/logger';

const logger = createLogger('review.controller');

class ReviewController extends BaseController<IReview> {
  constructor() {
    super(ReviewModel);
  }

  async getAnalysis(req: AuthRequest, res: Response) {
    const { businessId } = req.user!;
    const today = daysAgo(0);
    const sevenDaysAgo = daysAgo(7);

    this.debug('Getting analysis for business', businessId);

    const reviews = await this.model.find({
      date: { $gte: sevenDaysAgo, $lt: today },
      businessId,
    });

    this.debug(`Found ${reviews.length} reviews for business ${businessId}, generating analysis...`);

    const analysis: IBusinessAnalysis = {
      sentimentOverTime: this.getSentimentOverTime(reviews),
      wordsFrequencies: this.getWordsFrequencies(reviews),
      dataSourceDistribution: this.getDataSourceDistribution(reviews),
    };

    this.debug(`Retuning generated analysis for business ${businessId}`);
    return res.status(httpStatus.OK).send(analysis);
  }

  async generateResponseForReview(req: AuthRequest<{}, IReviewReply, IGenerateReviewReply>, res: Response) {
    // TODO: implement this function with calls to OpenAPI
    const { reviewText, prompt, previousReplies } = req.body;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    res.status(httpStatus.OK).send({
      text: `This should return a generated response for the review: ${reviewText} with ${previousReplies.length} previous replies and the prompt "${prompt}"`,
    });
  }

  async getPaginated(req: AuthRequest<{}, {}, {}, IGetReviewsParams>, res: Response<IGetAllReviewsResponse>) {
    const { limit, page, before, search } = req.query;

    try {
      const reviews = (await this.model
        .find({ businessId: req.user!.businessId, date: { $lt: before }, value: { $regex: search } })
        .limit(limit)
        .skip((page - 1) * limit)) as IReview[];

      return res.status(httpStatus.OK).send({
        currentPage: Number(page),
        totalReviews: await this.model.countDocuments({ businessId: req.user!.businessId }),
        reviews,
      });
    } catch (error) {
      logger.error('Error fetching reviews', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }

  private initializeSentimentOverTimeMap(): Map<string, ISentimentBarChartGroup> {
    const sentimentOverTime = new Map<string, ISentimentBarChartGroup>();

    for (let i = 1; i <= 7; i++) {
      const date = daysAgo(i);
      sentimentOverTime.set(date.toLocaleDateString(), {
        date: date.toLocaleDateString('en-GB'),
        positive: 0,
        negative: 0,
        neutral: 0,
      });
    }

    return sentimentOverTime;
  }

  private getSentimentOverTime(reviews: IReview[]): ISentimentBarChartGroup[] {
    const sentimentOverTime = this.initializeSentimentOverTimeMap();
    this.debug(`Sentiment over time initialized for ${sentimentOverTime.size} sentiments`);

    reviews.forEach((review) => {
      const dateData = sentimentOverTime.get(review.date.toLocaleDateString())!;
      dateData[review.sentiment]++;
    });

    return Array.from(sentimentOverTime.values()).reverse();
  }

  private getWordsFrequencies(reviews: IReview[]): IWordFrequency[] {
    const wordFrequency = new Map<string, number>();
    this.debug(`Calculating word frequency for ${reviews.length} reviews`);

    reviews.forEach((review) => {
      review.phrases.forEach((phrase) => {
        phrase.split(' ').forEach((word) => {
          const count = wordFrequency.get(word) ?? 0;
          wordFrequency.set(word, count + 1);
        });
      });
    });

    return Array.from(wordFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([text, value]) => ({ text, value }));
  }

  private getDataSourceDistribution(reviews: IReview[]): IPieChartData[] {
    const dataSources = new Map<string, number>();
    this.debug(`Calculating data source distribution for ${reviews.length} reviews`);

    reviews.forEach((review) => {
      const count = dataSources.get(review.dataSource) ?? 0;
      dataSources.set(review.dataSource, count + 1);
    });

    return Array.from(dataSources.entries()).map(([label, value], id) => ({ value, label, id }));
  }
}

export const reviewController = new ReviewController();
