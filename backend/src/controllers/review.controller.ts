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
import OpenAI from 'openai';
import ReviewModel from '../models/review.model';
import { BaseController } from './base.controller';
import { AuthRequest } from 'common/auth.middleware';
import httpStatus from 'http-status';
import { Response } from 'express';
import { daysAgo } from '../utils/date';
import config from '../config';

class ReviewController extends BaseController<IReview> {
  private openai: OpenAI;

  constructor() {
    super(ReviewModel);
    this.openai = new OpenAI({ apiKey: config.openaiApiKey });
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
    const { reviewText, prompt, previousReplies } = req.body;
    const formattedPreviousReplies = previousReplies
      .slice(-4) // Take the latest 4 replies
      .map((reply, i) => `${i + 1}. "${reply}"`)
      .join('\n');
    const previousRepliesMessage = `Here are some replies I'm not satisfied with, try to write a review which is different in phrasing and meaning than these: ${formattedPreviousReplies}`;
    const promptMessage = `I want the reply to focus on "${prompt}"`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are a customer success advisor and write replies to customer reviews in "${req.user!.businessName}".
You should provide the customer with the best overall experience, so that he keeps using the company's products.
You are given a customer's review. Read the review and write a straight reply that expresses the company's thoughts on the review.
Appreciate positive reviews and try to understand and show will to improve in the near future for the negative ones.
The reply should not exceed 120 words but should end up with less than 120 words and should be written in a more friendly yet polite tone.
The customer may provide a prompt by the customer to focus on a specific aspect of the review.
The customer may also provide a list of previous replies that did not satisfy him.`,
      },
    ];

    if (previousReplies.length > 0) {
      messages.push({ role: 'user', content: previousRepliesMessage });
    }

    if (prompt.length > 0) {
      messages.push({ role: 'user', content: promptMessage });
    }

    messages.push(
      { role: 'user', content: reviewText },
      {
        role: 'system',
        content: 'Output in JSON: { "text": "reply_content" }',
      }
    );

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
    });

    const { text }: IReviewReply = JSON.parse(response.choices[0].message.content!);

    return res.status(httpStatus.OK).send({
      text,
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
