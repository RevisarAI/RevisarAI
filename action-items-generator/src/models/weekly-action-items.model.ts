import { datalake } from '../db';
import { IActionItem, IWeeklyActionItems } from 'shared-types';

const ActionItemSchema = new datalake.Schema<IActionItem>({
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

const WeeklyActionItemsSchema = new datalake.Schema<IWeeklyActionItems>({
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

export default datalake.model<IWeeklyActionItems>('WeeklyActionItems', WeeklyActionItemsSchema);
