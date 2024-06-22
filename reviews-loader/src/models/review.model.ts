import mongoose from 'mongoose';
import { IReview } from 'shared-types';

const reviewSchema = new mongoose.Schema<IReview>({
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

export default mongoose.model<IReview>('Review', reviewSchema);
