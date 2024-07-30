import { generateMongooseModel } from 'revisar-server-utils/db';
import { IReview, ReviewMongooseSchema } from 'shared-types';
import { datalake } from '../db';

export default generateMongooseModel<IReview>(datalake, ReviewMongooseSchema);
