import { AxiosInstance } from 'axios';
import { createApiClient } from './api-client';
import { IActionItem } from 'shared-types';

export class ActionItemsService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = createApiClient('/action-items');
  }

  async getWeeklyActionItems(): Promise<IActionItem[]>{
    return (await this.apiClient.get('')).data;
  }
}

export const actionItemsService = new ActionItemsService();
