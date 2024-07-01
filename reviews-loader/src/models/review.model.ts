import { db } from '../db';
import { IReview } from 'shared-types';

const reviewSchema = new db.Schema<IReview>({
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
  },
  sentiment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  phrases: {
    type: [String],
    required: true,
  },
  dataSource: {
    type: String,
    required: true,
  },
});

export default db.model<IReview>('Review', reviewSchema);
