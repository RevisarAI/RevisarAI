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
    return (
      await this.apiClient.post<IUserTokens>(
        '/google',
        { credential: credential },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
    ).data;
  }

  async googleAdditionalDetails(
    { businessName, businessDescription }: IUserDetails,
    token: string
  ): Promise<IUserTokens> {
    return (
      await this.apiClient.put(
        '/google',
        { businessName, businessDescription },
        {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        }
      )
    ).data;
  }

  async refreshAccessToken(refreshToken: string, signal?: AbortSignal): Promise<IUserTokens> {
    // TODO: implement
  }

  async register(newUser: ICreateUser): Promise<IUserTokens> {
    return (
      await this.apiClient.post('/register', newUser, {
        headers: { 'Content-Type': 'application/json' },
      })
    ).data;
  }

  async logout(refreshToken: string): Promise<void> {
    return (
      await this,
      this.apiClient.get('/logout', {
        headers: { Authorization: `Bearer ${refreshToken}` },
      })
    );
  }
}

export const authenticationService = new AuthenticationService();
