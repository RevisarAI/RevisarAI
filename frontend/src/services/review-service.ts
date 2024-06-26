import { AxiosInstance } from 'axios';
import { IBusinessAnalysis } from 'shared-types';
import { createApiClient } from './api-client';

interface IGetBusinessAnalysisParams {
  signal?: AbortSignal;
}
export class ReviewsService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = createApiClient('/reviews');
  }

  async getBusinessAnalysis({ signal }: IGetBusinessAnalysisParams): Promise<IBusinessAnalysis> {
    return (await this.apiClient.get<IBusinessAnalysis>('/analysis', { signal })).data;
  }
}

export const reviewService = new ReviewsService();
