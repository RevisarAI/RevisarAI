import mongoose from 'mongoose';
import { IWeeklyActionItems, WeeklyActionItemsMongooseSchema } from 'shared-types';

const WeeklyActionItemsSchema = new mongoose.Schema<IWeeklyActionItems>(WeeklyActionItemsMongooseSchema.schema);

export default mongoose.model<IWeeklyActionItems>(WeeklyActionItemsMongooseSchema.name, WeeklyActionItemsSchema);
