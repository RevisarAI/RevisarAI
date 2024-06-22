import { IReview, ISentimentBarChartGroup, IWordFrequency, Sentiment } from 'shared-types';
import ReviewModel from '../models/review.model';
import { BaseController } from './base.controller';
import { AuthRequest } from 'common/auth.middleware';
import httpStatus from 'http-status';
import { Response } from 'express';

class ReviewController extends BaseController<IReview> {
  constructor() {
    super(ReviewModel);
  }

  async getAnalysis(req: AuthRequest, res: Response) {
    const { businessId } = req.user!;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const reviews = await this.model.find({
      date: { $gte: sevenDaysAgo, $lt: today },
      businessId,
    });

    const analysis = {
      sentimentOverTime: this.getSentimentOverTime(reviews),
      wordsFrequencies: this.getWordsFrequencies(reviews),
    };
    return res.status(httpStatus.OK).send(analysis);
  }

  private getSentimentOverTime(reviews: IReview[]): ISentimentBarChartGroup[] {
    const sentimentOverTime = new Map<string, ISentimentBarChartGroup>();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Initialize the map with all dates from the last week
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      sentimentOverTime.set(date.toLocaleDateString(), {
        date: date.toLocaleDateString(),
        positive: 0,
        negative: 0,
        neutral: 0,
      });
    }

    reviews.forEach((review) => {
      const dateData = sentimentOverTime.get(review.date.toDateString())!;
      dateData[review.sentiment as Sentiment]++;
    });

    return Array.from(sentimentOverTime.values());
  }

  private getWordsFrequencies(reviews: IReview[]): IWordFrequency[] {
    const wordFrequency = new Map<string, number>();

    reviews.forEach((review) => {
      review.value.split(' ').forEach((word) => {
        const count = wordFrequency.get(word) ?? 0;
        wordFrequency.set(word, count + 1);
      });
    });

    return Array.from(wordFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([text, value]) => ({ text, value }));
  }
}

export const reviewController = new ReviewController();
