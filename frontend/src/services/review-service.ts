import { AxiosInstance } from 'axios';
import {
  IBusinessAnalysis,
  IGenerateReviewReply,
  IGetAllReviewsResponse,
  IGetReviewsParams,
  IReviewReply,
} from 'shared-types';
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

  async getReviews(
    { page = 1, limit = 10, before }: IGetReviewsParams,
    signal: AbortSignal
  ): Promise<IGetAllReviewsResponse> {
    return (await this.apiClient.get<IGetAllReviewsResponse>('/', { params: { page, limit, before }, signal })).data;
  }

  async generateReviewReply({ reviewText, prompt, previousReplies = [] }: IGenerateReviewReply): Promise<IReviewReply> {
    return (await this.apiClient.post<IReviewReply>('/reply', { reviewText, prompt, previousReplies })).data;
  }
}

export const reviewService = new ReviewsService();
