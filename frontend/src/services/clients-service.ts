import { AxiosInstance } from 'axios';
import { IBusinessProfile, IUserTokens } from 'shared-types';
import { createApiClient } from './api-client';

export class ClientsService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = createApiClient('/clients');
  }

  async updateClientInfo(business: IBusinessProfile): Promise<IUserTokens> {
    return (await this.apiClient.put('/businesses/', business)).data;
  }
}

export const clientsService = new ClientsService();
