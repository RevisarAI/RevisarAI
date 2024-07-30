import { generateMongooseModel } from 'revisar-server-utils/db';
import { datalake } from '../db';
import { IWeeklyActionItems, WeeklyActionItemsMongooseSchema } from 'shared-types';

export default generateMongooseModel<IWeeklyActionItems>(datalake, WeeklyActionItemsMongooseSchema);
