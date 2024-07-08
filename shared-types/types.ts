import { Types as mongooseTypes } from 'mongoose';
import {
  IActionItemSchema,
  IWeeklyActionItemsSchema,
  IClientSchema,
  ICreateUserSchema,
  IGenerateReviewReplySchema,
  IGetReviewsBodySchema,
  ILoginFormDataSchema,
  IReviewReplySchema,
  IUserDetailsSchema,
  IBusinessProfileSchema,
  ICreateApiKeySchema,
  ICreateApiKeyResponseSchema,
  IApiKeySchema,
  IApiKeyMinimalSchema,
  IRevokeApiKeySchema,
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
  importance: number;
}
export type IReview = IRawReview & IReviewAnalaysis & { _id?: mongooseTypes.ObjectId };
export type IReviewMinimal = Pick<IReview, '_id' | 'value'>;

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

export type IApiKey = z.infer<typeof IApiKeySchema>;

export type ICreateApiKey = z.infer<typeof ICreateApiKeySchema>;
export type ICreateApiKeyResponse = z.infer<typeof ICreateApiKeyResponseSchema>;
export type IApiKeyMinimal = z.infer<typeof IApiKeyMinimalSchema>;
export type IRevokeApiKey = z.infer<typeof IRevokeApiKeySchema>;

export enum WeekdaysEnum {
  SUNDAY = 'Sunday',
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
}

export type IWeeklyActionItems = z.infer<typeof IWeeklyActionItemsSchema>;
export type IActionItem = z.infer<typeof IActionItemSchema>;
export type IBusinessProfile = z.infer<typeof IBusinessProfileSchema>;
