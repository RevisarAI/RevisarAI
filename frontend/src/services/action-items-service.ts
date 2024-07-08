import { AxiosInstance } from 'axios';
import { createApiClient } from './api-client';
import { IActionItem, IWeeklyActionItems } from 'shared-types';

export class ActionItemsService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = createApiClient('/action-items');
  }

  async getWeeklyActionItems(): Promise<IWeeklyActionItems> {
    return (await this.apiClient.get('')).data;
  }

  async updateActionItem(actionItem: IActionItem): Promise<IActionItem> {
    return (await this.apiClient.put('', actionItem)).data;
  }
}

export const actionItemsService = new ActionItemsService();
