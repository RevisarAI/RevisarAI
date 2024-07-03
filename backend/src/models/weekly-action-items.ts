import mongoose from 'mongoose';
import { IWeeklyActionItems, WeeklyActionItemsMongooseSchema } from 'shared-types';

const WeeklyActionItemsSchema = new mongoose.Schema<IWeeklyActionItems>(WeeklyActionItemsMongooseSchema.schema);

WeeklyActionItemsSchema.index({ businessId: 1, date: 1 });
export default mongoose.model<IWeeklyActionItems>(WeeklyActionItemsMongooseSchema.name, WeeklyActionItemsSchema);
