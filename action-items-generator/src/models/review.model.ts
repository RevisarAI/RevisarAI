import { datalake } from '../db';
import { IReview, ReviewMongooseSchema } from 'shared-types';

const reviewSchema = new datalake.Schema<IReview>(ReviewMongooseSchema.schema);

export default datalake.model<IReview>(ReviewMongooseSchema.name, reviewSchema);
