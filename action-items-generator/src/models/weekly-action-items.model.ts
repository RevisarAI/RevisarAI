import { generateMongooseModel } from 'revisar-server-utils/db';
import { IWeeklyActionItems, WeeklyActionItemsMongooseSchema } from 'shared-types';
import { datalake } from '../db';

export default generateMongooseModel<IWeeklyActionItems>(datalake, WeeklyActionItemsMongooseSchema);
