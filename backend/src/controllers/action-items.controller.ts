import WeeklyActionItemsModel from '../models/weekly-action-items';
import { BaseController } from './base.controller';
import { IActionItem, IWeeklyActionItems } from 'shared-types';
import { Response } from 'express';
import { AuthRequest } from '../common/auth.middleware';
import httpStatus from 'http-status';

class ActionItemsController extends BaseController<IWeeklyActionItems> {
  constructor() {
    super(WeeklyActionItemsModel);
  }

  async getWeeklyActionItems(req: AuthRequest, res: Response<IWeeklyActionItems>) {
    const { businessId } = req.user!;
    const weeklyActionItems = await WeeklyActionItemsModel.findOne({ businessId }).sort({ date: -1 });

    if (!weeklyActionItems) {
      const emptyResponse: IWeeklyActionItems = {
        actionItems: [],
        date: new Date(),
        businessId,
      };
      return res.status(httpStatus.NO_CONTENT).send(emptyResponse);
    }

    return res.status(httpStatus.OK).send(weeklyActionItems);
  }

  async updateActionItem(req: AuthRequest, res: Response<void>) {
    const { id } = req.query;
    const actionItem: IActionItem = req.body;

    const result = await WeeklyActionItemsModel.updateOne(
      { _id: id, 'actionItems._id': actionItem._id },
      { $set: { 'actionItems.$.isCompleted': actionItem.isCompleted } }
    );
    if (result.modifiedCount === 0) {
      return res.status(httpStatus.NOT_FOUND).send();
    }
    return res.status(httpStatus.OK).send();
  }
}

export const actionItemsController = new ActionItemsController();
