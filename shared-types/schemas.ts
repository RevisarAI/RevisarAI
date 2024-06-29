import { Types as mongooseTypes } from 'mongoose';
import { z } from 'zod';

export const IPaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
});

export const IGetReviewsBodySchema = IPaginationSchema.extend({
  before: z.string().default(new Date().toISOString()),
});

export const IClientSchema = z.object({
  _id: z.instanceof(mongooseTypes.ObjectId).optional(),
  email: z.string(),
  fullName: z.string(),
  businessName: z.string(),
  businessDescription: z.string(),
  businessId: z.string(),
  password: z.string(),
  tokens: z.array(z.string()).optional(),
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

export const IGenerateReviewReplySchema = z.object({
  reviewText: z.string(),
  prompt: z.string().default(''),
  previousReplies: z.array(z.string()).optional().default([]),
});

export const IReviewReplySchema = z.object({
  text: z.string(),
});
