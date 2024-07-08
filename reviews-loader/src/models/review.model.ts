import { generateMongooseModel } from 'revisar-server-utils/db';
import { db } from '../db';
import { IReview, ReviewMongooseSchema } from 'shared-types';

export default generateMongooseModel<IReview>(db, ReviewMongooseSchema);
