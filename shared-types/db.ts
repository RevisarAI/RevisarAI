import { IndexDefinition, IndexDirection, IndexOptions, SchemaDefinition } from 'mongoose';
import { IApiKey, IActionItem, IReview, IWeeklyActionItems } from './types';

type IndexDef<T> = IndexDefinition & {
  [key in keyof T]: IndexDirection; // Just means { keyInT: 1, otherKeyInT: -1 }
};

interface SchemaIndex<T> {
  index: IndexDef<T>;
  options?: IndexOptions;
}

export interface IMongooseSchemaConfig<T> {
  name: string;
  schema: SchemaDefinition<T>;
  indexes?: SchemaIndex<T>[];
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

const ActionItemMongooseSchema: IMongooseSchemaConfig<IActionItem> = {
  name: 'ActionItem',
  schema: {
    value: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      required: false,
      default: false,
    },
    reason: {
      type: String,
      required: false,
    },
  },
};

export const WeeklyActionItemsMongooseSchema: IMongooseSchemaConfig<IWeeklyActionItems> = {
  name: 'WeeklyActionItems',
  schema: {
    actionItems: [
      {
        type: ActionItemMongooseSchema.schema,
        required: true,
      },
    ],
    date: {
      type: Date,
      required: true,
      index: true,
    },
    businessId: {
      type: String,
      required: true,
      index: true,
    },
  },
};
