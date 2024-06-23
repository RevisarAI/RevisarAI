import { AuthRequest } from '../common/auth.middleware';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { IUserDetails } from 'shared-types';
import createLogger from '../utils/logger';
import config from '../config';
import { extractBearerToken } from '../utils/tokens';

const logger = createLogger('auth middleware');

// Add user property to express request interface
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: IUserDetails;
    }
  }
}
export { Request as AuthRequest };

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = extractBearerToken(req);
  if (!token) return res.status(httpStatus.UNAUTHORIZED).send('No token provided');

  try {
    const user = <IUserDetails>jwt.verify(token, config.accessTokenSecret);
    req.user = user;
    return next();
  } catch (err) {
    logger.error(err);
    return res.status(httpStatus.UNAUTHORIZED).send((err as Error).message);
  }
};

export default authMiddleware;
