import { Types as mongooseTypes } from 'mongoose';
import { z } from 'zod';
import { WeekdaysEnum } from './types';

export const IClientSchema = z.object({
  _id: z.instanceof(mongooseTypes.ObjectId).optional(),
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

export const IBusinessDetailsSchema = IClientSchema.pick({
  businessId: true,
  businessName: true,
  businessDescription: true,
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
