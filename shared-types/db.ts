import { SchemaDefinition } from 'mongoose';
import { IApiKey, IReview } from './types';

export interface IMongooseSchemaConfig<T> {
  name: string;
  schema: SchemaDefinition<T>;
}
export const ReviewMongooseSchema: IMongooseSchemaConfig<IReview> = {
  name: 'Review',
  schema: {
    value: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    businessId: {
      type: String,
      required: true,
      index: true,
    },
    sentiment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    phrases: [
      {
        type: String,
        required: true,
      },
    ],
    dataSource: {
      type: String,
      required: true,
    },
    importance: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
};

export const ApiKeyMongooseSchema: IMongooseSchemaConfig<IApiKey> = {
  name: 'ApiKey',
  schema: {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    businessId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiry: {
      type: Date,
      required: true,
    },
    revoked: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
};
