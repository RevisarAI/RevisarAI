import { metadata } from '../db';
import { IWeeklyActionItems, WeeklyActionItemsMongooseSchema } from 'shared-types';

const WeeklyActionItemsSchema = new metadata.Schema<IWeeklyActionItems>(WeeklyActionItemsMongooseSchema.schema);

export default metadata.model<IWeeklyActionItems>(WeeklyActionItemsMongooseSchema.name, WeeklyActionItemsSchema);
