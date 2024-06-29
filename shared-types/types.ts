import { Types as mongooseTypes } from 'mongoose';
import {
  IClientSchema,
  ICreateUserSchema,
  IGenerateReviewReplySchema,
  IGetReviewsBodySchema,
  ILoginFormDataSchema,
  IReviewReplySchema,
  IUserDetailsSchema,
} from './schemas';
import { z } from 'zod';

export type IClient = z.infer<typeof IClientSchema>;

export type IUserDetails = z.infer<typeof IUserDetailsSchema>;

export type ICreateUser = z.infer<typeof ICreateUserSchema>;

export type ILoginFormData = z.infer<typeof ILoginFormDataSchema>;

export type IGenerateReviewReply = z.infer<typeof IGenerateReviewReplySchema>;

export type IReviewReply = z.infer<typeof IReviewReplySchema>;

export type IGetReviewsParams = z.infer<typeof IGetReviewsBodySchema>;

export interface IUserTokens {
  accessToken: string;
  refreshToken: string;
}

export enum DataSourceEnum {
  API = 'API',
  TRIPADVISOR = 'TripAdvisor',
  GOOGLE = 'Google',
}
export interface IRawReview {
  businessId: string;
  value: string;
  date: Date;
  dataSource: DataSourceEnum;
}

export interface IBatchReview {
  value: string;
  date: Date;
}

export interface IReviewAnalaysis {
  sentiment: SentimentEnum;
  rating: number;
  phrases: string[];
}
export type IReview = IRawReview & IReviewAnalaysis & { _id?: mongooseTypes.ObjectId | string };

export interface IPieChartData {
  id: number;
  value: number;
  label: string;
}

export interface IGetAllReviewsResponse {
  reviews: IReview[];
  currentPage: number;
  totalReviews: number;
}

export interface ISentimentBarChartGroup {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}

export interface IWordFrequency {
  text: string;
  value: number;
}

export enum SentimentEnum {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral',
}

export interface IBusinessAnalysis {
  sentimentOverTime: ISentimentBarChartGroup[];
  wordsFrequencies: IWordFrequency[];
  dataSourceDistribution: IPieChartData[];
}
