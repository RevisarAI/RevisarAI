import axios, { AxiosInstance } from 'axios';
import { IBusinessDetails } from 'shared-types';

export class BusinessService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({ baseURL: `/businesses` });
  }

  async updateClientInfo(business: IBusinessDetails): Promise<void>{
    return (await this,this.apiClient.put('/', business));
  }
}

export const businessService = new BusinessService();