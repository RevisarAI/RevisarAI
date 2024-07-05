import { AxiosInstance } from 'axios';
import { createApiClient } from './api-client';
import { IActionItem } from 'shared-types';

export class ActionItemsService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = createApiClient('/action-items');
  }

  async getWeeklyActionItems(): Promise<IActionItem[]>{
    console.log((await this.apiClient.get('')).data.actionItems);
    return (await this.apiClient.get('')).data.actionItems;
  }
}

export const actionItemsService = new ActionItemsService();
