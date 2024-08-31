import { Request, Response, NextFunction } from 'express';
import ApiKey from '../models/api-key.model';
import { compare } from 'bcrypt';
import httpStatus from 'http-status';
import { ApiKeyRequest } from '../common/api-key.middleware';
import { createLogger } from 'revisar-server-utils';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      businessId: string;
    }
  }
}

export { Request as ApiKeyRequest };

const logger = createLogger('api key middleware');

const checkApiKey = async (req: ApiKeyRequest, res: Response, next: NextFunction) => {
  const apiKey = req.header('x-api-key');

  if (!apiKey) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: 'API key is missing' });
  }

  const [businessId] = apiKey.split(':');
  logger.debug(`Request from business ${businessId}`);

  const validUserKeys = await ApiKey.find({ businessId, revoked: false, expiry: { $gte: new Date() } });

  const isValid = (await Promise.all(validUserKeys.map(({ key }) => compare(apiKey, key)))).some(Boolean);

  if (!isValid) {
    logger.debug(`Invalid api key for business ${businessId}`);
    return res.status(httpStatus.FORBIDDEN).json({ message: 'Invalid API key' });
  }

  logger.debug(`Successfully authenticated business ${businessId}`);
  req.businessId = businessId;

  return next();
};

export default checkApiKey;
