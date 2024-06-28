import mongoose from 'mongoose';
import { IReview, ReviewMongoseSchema } from 'shared-types';

const reviewSchema = new mongoose.Schema<IReview>(ReviewMongoseSchema.schema);

export default mongoose.model<IReview>(ReviewMongoseSchema.name, reviewSchema);
