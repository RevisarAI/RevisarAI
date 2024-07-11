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
  IReviewReplySchema,
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
    const { reviewText, prompt, previousReplies } = req.body;
    const formattedPreviousReplies = previousReplies
      .slice(-4) // Take the latest 4 replies (the frontend should also send 4 replies at most)
      .map((reply, i) => `${i + 1}. "${reply}"`)
      .join('\n');
    const previousRepliesMessage = `Example Replies: Here are some replies I'm not satisfied with, try to write a review which is different in phrasing and meaning than these: ${formattedPreviousReplies}`;
    const promptMessage = `Based on the example replies, here are some further instructions: ${prompt}`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `Background: You are a customer success advisor that write replies to customer reviews in "${req.user!.businessName}".
The manager of the company has asked you to write a reply to a customer review.
Your reply should provide the customer with the best overall experience, so that he keeps using the company's products.
The manager provides you with the following data:
Inputs:
1. A customer's review
2. An optional list of example replies that did not satisfy the manager
3. Optional further instructions from the manager to consider for writing a better reply.
General Instructions: 
Appreciate positive reviews and try to understand and show will to improve in the near future for the negative ones.
The reply should contain 20-70 words at average and 110 at maximum and should be written in a friendly yet polite tone.
Goal:
Read the review and write a straight reply that expresses the company's thoughts on the review.
Consider the further instructions and example replies if provided by the manager to make your reply more precise.`,
      },
      { role: 'user', content: reviewText }, // User review
    ];

    if (previousReplies.length > 0) {
      messages.push({ role: 'user', content: previousRepliesMessage });
    }

    if (prompt.length > 0) {
      messages.push({ role: 'user', content: promptMessage });
    }

    messages.push({
      role: 'system',
      content: 'Output in JSON: { "text": "reply_content" }',
    });

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
    });

    const { text }: IReviewReply = IReviewReplySchema.parse(JSON.parse(response.choices[0].message.content!));

    return res.status(httpStatus.OK).send({
      text,
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
      const { message, stack } = error as Error;
      this.debug(`Error fetching reviews ${message}, ${stack}`);
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
      const dateData = sentimentOverTime.get(new Date(review.date).toLocaleDateString())!;
      dateData[review.sentiment]++;
    });

    return Array.from(sentimentOverTime.values()).reverse();
  }

  private getWordsFrequencies(reviews: IReview[]): IWordFrequency[] {
    const wordFrequency = new Map<string, number>();
    this.debug(`Calculating word frequency for ${reviews.length} reviews`);

    const isWantedWord = (word: string) =>
      !['was', 'the', 'is', 'a', 'to', 'into', 'of', 'at', 'on', 'in', 'are', 'and'].includes(word.toLowerCase());

    reviews.forEach((review) => {
      review.phrases.forEach((phrase) => {
        phrase
          .split(' ')
          .filter(isWantedWord)
          .forEach((word) => {
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
