import { Types as mongooseTypes } from 'mongoose';
import { IClientSchema, ICreateUserSchema, ILoginFormDataSchema, IUserDetailsSchema } from './schemas';
import { z } from 'zod';

export type IClient = z.infer<typeof IClientSchema>;

export type IUserDetails = z.infer<typeof IUserDetailsSchema>;

export type ICreateUser = z.infer<typeof ICreateUserSchema>;

export type ILoginFormData = z.infer<typeof ILoginFormDataSchema>;

export interface IUserTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IRawReview {
  businessId: string;
  value: string;
  date: Date;
}

export interface IReviewAnalaysis {
  sentiment: string;
  rating: number;
  phrases: string[];
}
export type IReview = IRawReview & IReviewAnalaysis & { _id?: mongooseTypes.ObjectId };
