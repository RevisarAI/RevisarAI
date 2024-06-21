import { authenticationService } from '@/services/auth-service';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import * as React from 'react';
import { QueryStatus, useQuery } from '@tanstack/react-query';
import { IUserDetails } from 'shared-types';
import { clearTokens, writeTokens } from '../utils/local-storage';

export const isTokenExpired = (token: string): boolean => {
  const payload = jwtDecode<JwtPayload>(token);
  return payload.exp !== undefined && Date.now() >= payload.exp * 1000;
};

const useRememberMe = () =>
  useQuery({
    retry: false,
    refetchOnWindowFocus: false,
    queryKey: ['refreshToken'],
    queryFn: async ({ signal }) => {
      const refreshToken = localStorage.getItem('refreshToken');
      const accessToken = localStorage.getItem('token');

      try {
        if (accessToken === null || refreshToken === null) {
          throw new Error();
        } else {
          if (isTokenExpired(accessToken)) {
            // Current access token expried and refresh token should be used to fetch new one
            const newTokens = await authenticationService.refreshAccessToken(refreshToken, signal);
            writeTokens(newTokens, true);
            return newTokens;
          }

          // Current access token is still valid
          writeTokens({ accessToken, refreshToken }, true);
          return { accessToken, refreshToken };
        }
      } catch {
        clearTokens();
        throw new Error('User is not logged in. No access token and refresh token found.');
      }
    },
  });

export interface AuthContext {
  isAuthenticated: boolean;
  setUser: (user: IUserDetails | null) => void;
  user: IUserDetails | null;
  refreshTokenStatus: QueryStatus;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<IUserDetails | null>(null);
  const { data: savedUserTokens, status } = useRememberMe();

  if (savedUserTokens && user === null) {
    const userDetails = jwtDecode<JwtPayload & IUserDetails>(savedUserTokens.accessToken, {});
    setUser(userDetails);
  }

  const isAuthenticated = !!user;
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, refreshTokenStatus: status }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
