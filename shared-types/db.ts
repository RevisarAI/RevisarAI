import { SchemaDefinition } from 'mongoose';
import { IReview } from './types';

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
