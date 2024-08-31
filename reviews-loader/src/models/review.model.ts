import { generateMongooseModel } from 'revisar-server-utils/db';
import { datalake } from '../db';
import { IReview, ReviewMongooseSchema } from 'shared-types';

export default generateMongooseModel<IReview>(datalake, ReviewMongooseSchema);
