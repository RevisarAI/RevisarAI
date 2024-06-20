import axios, { AxiosInstance } from 'axios';

export class AuthenticationService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({ baseURL: `/auth` });
  }

  async login(email: string, password: string, signal?: AbortSignal): Promise<UserTokens> {
    // TODO: implement
  }

  async refreshAccessToken(refreshToken: string, signal?: AbortSignal): Promise<UserTokens> {
    // TODO: implement
  }

  async register(newUser: IUserDetails & { password: string }): Promise<UserTokens> {
    // TODO: implement
  }

  async logout(refreshToken: string): Promise<void> {
    // TODO: implement
  }
}

export const authenticationService = new AuthenticationService();
