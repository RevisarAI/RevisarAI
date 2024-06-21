import axios, { AxiosInstance } from 'axios';
import { authenticationService } from './auth-service';
import { writeTokens } from '@/utils/local-storage';

/**
 *
 * @param endpoint prefix of the api endpoint
 * @returns A configured Axios instance which will be used to make requests to the API
 * and handle token refreshing when necessary
 */
export const createApiClient = (endpoint: string = ''): AxiosInstance => {
  const apiClient = axios.create({ baseURL: `/api${endpoint}` });

  apiClient.interceptors.request.use(
    (config) => {
      const token = sessionStorage.getItem('token');

      if (token && !config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    },
    async (error) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (axios.isAxiosError(error) && error.config) {
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (error.response?.status === 401 && error.response?.data === 'jwt expired' && refreshToken) {
          const tokens = await authenticationService.refreshAccessToken(refreshToken);
          error.config.headers.Authorization = `Bearer ${tokens.accessToken}`;

          // Save new tokens
          writeTokens(tokens, localStorage.getItem('token') !== null);

          // Retry request with newly fetched token
          return apiClient(error.config);
        }
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
};
