import mongoose from 'mongoose';
import { generateMongooseModel } from 'revisar-server-utils/db';
import { IWeeklyActionItems, WeeklyActionItemsMongooseSchema } from 'shared-types';

export default generateMongooseModel<IWeeklyActionItems>(mongoose, WeeklyActionItemsMongooseSchema);
