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

  async updateActionItem(req: AuthRequest<IActionItem>, res: Response<IWeeklyActionItems>) {
    const { id } = req.query;
    const actionItem: IActionItem = req.body;

    const weeklyActionItems = await WeeklyActionItemsModel.findOneAndUpdate(
      { _id: id, 'actionItems._id': actionItem._id },
      { $set: { 'actionItems.$.isCompleted': actionItem.isCompleted } },
      { new: true }
    );
    if (!weeklyActionItems) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.status(httpStatus.OK).send(weeklyActionItems);
  }
}

export const actionItemsController = new ActionItemsController();
