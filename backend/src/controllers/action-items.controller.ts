import WeeklyActionItemsModel from '../models/weekly-action-items';
import { BaseController } from './base.controller';
import { IWeeklyActionItems } from 'shared-types';
import { Response } from 'express';
import { AuthRequest } from '../common/auth.middleware';
import httpStatus from 'http-status';

class ActionItemsController extends BaseController<IWeeklyActionItems> {
  constructor() {
    super(WeeklyActionItemsModel);
  }

  async getWeeklyActionItems(req: AuthRequest, res: Response<IWeeklyActionItems>) {
    const { businessId } = req.user!;
    const [weeklyActionItems] = await WeeklyActionItemsModel.find({ businessId }).sort({ date: -1 }).limit(1);

    if (!weeklyActionItems) {
      return res.status(httpStatus.NOT_FOUND).send();
    }

    return res.status(httpStatus.OK).send(weeklyActionItems);
  }
}

export const actionItemsController = new ActionItemsController();
