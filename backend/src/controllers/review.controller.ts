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
  DataSourceEnum,
  SentimentEnum,
} from 'shared-types';
import ReviewModel from '../models/review.model';
import { BaseController } from './base.controller';
import { AuthRequest } from 'common/auth.middleware';
import httpStatus from 'http-status';
import { Response } from 'express';
import { daysAgo } from '../utils/date';

class ReviewController extends BaseController<IReview> {
  constructor() {
    super(ReviewModel);
  }

  async getAnalysis(req: AuthRequest, res: Response) {
    const { businessId } = req.user!;
    const today = daysAgo(0);
    const sevenDaysAgo = daysAgo(7);

    const reviews = await this.model.find({
      date: { $gte: sevenDaysAgo, $lt: today },
      businessId,
    });

    const analysis: IBusinessAnalysis = {
      sentimentOverTime: this.getSentimentOverTime(reviews),
      wordsFrequencies: this.getWordsFrequencies(reviews),
      dataSourceDistribution: this.getDataSourceDistribution(reviews),
    };
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
    // TODO: implement this function
    // It should query all reviews before `before` with their value filtered by `search`
    // It return paginated results with `limit` and `page`
    // ! Please notice that page parameter starts from 1 ! //

    // Simulated a loading
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Return static random data
    return res.status(httpStatus.OK).send({
      currentPage: 1,
      totalReviews: limit * 100,
      reviews: Array.from({ length: Math.floor(1 + Math.random() * limit) }).map(() => ({
        value:
          'This platform is a game-changer! Having all my customer reviews in one place with clear insights is fantastic. The sentiment analysis helped me identify areas to improve, and the action items are super helpful. Highly recommend!',
        phrases: [
          'game-changer',
          'clear insights',
          'helped me identify areas to improve',
          'action items are super helpful',
          'highly recommend',
        ],
        _id: Math.random().toString(36).substring(7),
        date: new Date(),
        businessId: req.user!.businessId,
        sentiment: Object.values(SentimentEnum)[Math.floor(Math.random() * 3)],
        rating: Math.floor(1 + Math.random() * 10),
        dataSource: Object.values(DataSourceEnum)[Math.floor(Math.random() * 3)],
      })),
    });
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

    reviews.forEach((review) => {
      const dateData = sentimentOverTime.get(review.date.toLocaleDateString())!;
      dateData[review.sentiment]++;
    });

    return Array.from(sentimentOverTime.values()).reverse();
  }

  private getWordsFrequencies(reviews: IReview[]): IWordFrequency[] {
    const wordFrequency = new Map<string, number>();

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

    reviews.forEach((review) => {
      const count = dataSources.get(review.dataSource) ?? 0;
      dataSources.set(review.dataSource, count + 1);
    });

    return Array.from(dataSources.entries()).map(([label, value], id) => ({ value, label, id }));
  }
}

export const reviewController = new ReviewController();
