import axios, { AxiosInstance } from 'axios';
import { ICreateUser, IUserTokens, IUserDetails } from 'shared-types';

export class AuthenticationService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({ baseURL: `/auth` });
  }

  async login(email: string, password: string, signal?: AbortSignal): Promise<IUserTokens> {
    return (
      await this.apiClient.post<IUserTokens>(
        '/login',
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
          signal,
        }
      )
    ).data;
  }

  async googleSignIn(credential: string): Promise<IUserTokens> {
    // TODO: implement
  }

  async refreshAccessToken(refreshToken: string, signal?: AbortSignal): Promise<IUserTokens> {
    // TODO: implement
  }

  async register(newUser: ICreateUser): Promise<IUserDetails & IUserTokens> {
    return (
      await this.apiClient.post('/register', newUser, {
        headers: { 'Content-Type': 'application/json' },
      })
    ).data;
  }

  async logout(refreshToken: string): Promise<void> {
    // TODO: implement
  }
}

export const authenticationService = new AuthenticationService();
