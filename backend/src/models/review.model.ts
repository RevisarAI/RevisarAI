import { IReview } from 'shared-types';
import { datalake } from '../db';

const reviewSchema = new datalake.Schema<IReview>({
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
});

export default datalake.model<IReview>('reviews', reviewSchema);
