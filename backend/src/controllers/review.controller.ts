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
    const { limit, page, before } = req.query;
    // TODO: implement this function
    // ! Please notice that page parameter starts from 1 ! //
    const staticReview: IReview = {
      _id: '6676fb5e6f4000161b4c276b',
      value:
        'This platform is a game-changer! Having all my customer reviews in one place with clear insights is fantastic. The sentiment analysis helped me identify areas to improve, and the action items are super helpful. Highly recommend!',
      date: new Date('2024-06-21T16:22:36.562Z'),
      businessId: '56d4cc71-f5b4-4df8-9d31-8d09218ecbdb',
      sentiment: SentimentEnum.POSITIVE,
      rating: 9,
      phrases: [
        'game-changer',
        'clear insights',
        'helped me identify areas to improve',
        'action items are super helpful',
        'highly recommend',
      ],
      dataSource: DataSourceEnum.GOOGLE,
    };

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return res.status(httpStatus.OK).send({
      reviews: Array.from({ length: 1 }).map(() => staticReview),
      currentPage: 1,
      totalReviews: limit * 100,
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
