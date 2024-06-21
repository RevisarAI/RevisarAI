import jwt from 'jsonwebtoken';
import { IUserDetails, IUserTokens } from 'shared-types';

const signTokens = async (clientDetails: IUserDetails): Promise<IUserTokens> => {
  const accessToken = await jwt.sign(clientDetails, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  });
  const refreshToken = await jwt.sign(clientDetails, process.env.REFRESH_TOKEN_SECRET, {});
  return { accessToken, refreshToken };
};

export { signTokens };
