import { db } from '../db';
import { IReview, ReviewMongooseSchema } from 'shared-types';

const reviewSchema = new db.Schema<IReview>(ReviewMongooseSchema.schema);

export default db.model<IReview>(ReviewMongooseSchema.name, reviewSchema);
