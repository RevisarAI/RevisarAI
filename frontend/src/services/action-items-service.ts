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

  async updateActionItemStatus(item: IActionItem, itemsId: string): Promise<void> {
    await this.apiClient.put('/id', item, { params: { id: itemsId } });
  }
}

export const actionItemsService = new ActionItemsService();
