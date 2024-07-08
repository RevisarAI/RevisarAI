import mongoose from 'mongoose';
import { generateMongooseModel } from 'revisar-server-utils/db';
import { IReview, ReviewMongooseSchema } from 'shared-types';

export default generateMongooseModel<IReview>(mongoose, ReviewMongooseSchema);
