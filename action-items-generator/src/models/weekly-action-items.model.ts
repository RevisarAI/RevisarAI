import mongoose from 'mongoose';
import { IActionItem, IWeeklyActionItems } from 'shared-types';

const ActionItemSchema = new mongoose.Schema<IActionItem>({
  value: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    required: false,
    default: false,
  },
  reason: {
    type: String,
    required: false,
  },
});

const WeeklyActionItemsSchema = new mongoose.Schema<IWeeklyActionItems>({
  actionItems: {
    type: [ActionItemSchema],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  businessId: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IWeeklyActionItems>('WeeklyActionItems', WeeklyActionItemsSchema);
