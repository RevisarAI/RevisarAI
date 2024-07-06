import { createLogger } from '.';
import { Schema, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { IUserDetails } from 'shared-types';
import { AuthRequest } from '../revisar-server-utils/middlewares'
import config from './config'


export { Request as AuthRequest };

const logger = createLogger('middlewares');

interface RequestSchema {
  body?: Schema;
  query?: Schema;
  params?: Schema;
}

export const schemaValidationMiddleware =
  ({ body, query, params }: RequestSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const schema = z.object({
      body: body ?? z.object({}).optional(),
      query: query ?? z.object({}).optional(),
      params: params ?? z.object({}).optional(),
    });

    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const error = new ZodError(result.error.errors);
      return res.status(400).json({ error: error.errors });
    }

    return next();
  };

// Add user property to express request interface
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: IUserDetails;
    }
  }
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
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

const extractBearerToken = (req: Request): string | undefined => {
  const authHeader = req.headers['authorization'];
  return authHeader && authHeader.split(' ')[1]; // Bearer <token>
};
