import { AxiosInstance } from 'axios';
import { IBusinessAnalysis, IGenerateReviewReply, IReviewReply } from 'shared-types';
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

  async generateReviewReply({ reviewText, prompt, previousReplies = [] }: IGenerateReviewReply): Promise<IReviewReply> {
    return (await this.apiClient.post<IReviewReply>('/reply', { reviewText, prompt, previousReplies })).data;
  }
}

export const reviewService = new ReviewsService();
