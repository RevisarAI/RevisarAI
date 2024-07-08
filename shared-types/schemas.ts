import { Types as mongooseTypes } from 'mongoose';
import { z } from 'zod';
import { SentimentEnum, WeekdaysEnum } from './types';

export const IPaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
});

export const IGetReviewsBodySchema = IPaginationSchema.extend({
  before: z.string().default(new Date().toISOString()),
  search: z.string().optional().default(''),
});

export const IReviewAnalysisSchema = z.object({
  sentiment: z.nativeEnum(SentimentEnum),
  rating: z.number().int().min(1).max(10),
  phrases: z.array(z.string()),
  importance: z.number().int().min(0).max(100),
});

export const IClientSchema = z.object({
  _id: z.union([z.custom<mongooseTypes.ObjectId>(), z.string()]).optional(),
  email: z.string(),
  fullName: z.string(),
  businessName: z.string(),
  businessDescription: z.string(),
  businessId: z.string(),
  password: z.string(),
  tokens: z.array(z.string()).optional(),
  actionsRefreshWeekday: z.nativeEnum(WeekdaysEnum).optional(),
});

export const ICreateUserSchema = IClientSchema.pick({
  email: true,
  fullName: true,
  businessName: true,
  businessDescription: true,
  password: true,
});

export const ILoginFormDataSchema = z.object({
  email: z.string(),
  password: z.string(),
  remember: z.boolean().optional(),
});

export const IUserDetailsSchema = IClientSchema.omit({
  _id: true,
  password: true,
  tokens: true,
});

export const IWeeklyActionItemsRequestSchema = z.object({
  client: IUserDetailsSchema,
  date: z.coerce.date(),
});

export const IActionItemSchema = z.object({
  _id: z.instanceof(mongooseTypes.ObjectId).optional(),
  value: z.string(),
  reason: z.string(),
  isCompleted: z.boolean().optional().default(false),
});

export const IWeeklyActionItemsSchema = z.object({
  _id: z.instanceof(mongooseTypes.ObjectId).optional(),
  actionItems: z.array(IActionItemSchema),
  date: z.date(),
  businessId: z.string(),
});

export const IApiKeySchema = z.object({
  _id: z.union([z.custom<mongooseTypes.ObjectId>(), z.string()]),
  key: z.string(),
  businessId: z.string(),
  createdAt: z.date(),
  expiry: z.date().optional(),
  revoked: z.boolean(),
});

export const IApiKeyMinimalSchema = IApiKeySchema.pick({
  _id: true,
  createdAt: true,
  expiry: true,
  revoked: true,
});

export const ICreateApiKeySchema = z.object({
  expiry: z.date().optional(),
});

export const ICreateApiKeyResponseSchema = IApiKeySchema.pick({
  _id: true,
  key: true,
  expiry: true,
});

export const IRevokeApiKeySchema = z.object({
  id: z.string(),
});

export const IGenerateReviewReplySchema = z.object({
  reviewText: z.string(),
  prompt: z.string().default(''),
  previousReplies: z.array(z.string()).optional().default([]),
});

export const IReviewReplySchema = z.object({
  text: z.string(),
});

export const IBatchReviewList = z.object({
  businessId: z.string(),
  reviews: z
    .array(
      z.object({
        value: z.string(),
        date: z.string(),
      })
    )
    .nonempty(),
});

export const IBusinessProfileSchema = IClientSchema.pick({
  businessName: true,
  businessDescription: true,
});
