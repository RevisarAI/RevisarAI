import { datalake } from '../db';
import { IWeeklyActionItems, WeeklyActionItemsMongooseSchema } from 'shared-types';

const WeeklyActionItemsSchema = new datalake.Schema<IWeeklyActionItems>(WeeklyActionItemsMongooseSchema.schema);

export default datalake.model<IWeeklyActionItems>(WeeklyActionItemsMongooseSchema.name, WeeklyActionItemsSchema);
