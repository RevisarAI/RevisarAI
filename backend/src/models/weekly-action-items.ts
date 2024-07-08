import { generateMongooseModel } from 'revisar-server-utils/db';
import { metadata } from '../db';
import { IWeeklyActionItems, WeeklyActionItemsMongooseSchema } from 'shared-types';

export default generateMongooseModel<IWeeklyActionItems>(metadata, WeeklyActionItemsMongooseSchema);
