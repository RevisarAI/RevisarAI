import mongoose from 'mongoose';
import { IReview, ReviewMongooseSchema } from 'shared-types';

const reviewSchema = new mongoose.Schema<IReview>(ReviewMongooseSchema.schema);

export default mongoose.model<IReview>(ReviewMongooseSchema.name, reviewSchema);
