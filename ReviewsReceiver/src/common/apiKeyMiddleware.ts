import { Request, Response, NextFunction } from 'express';
import ApiKey from '../models/apiKeyModel';

const checkApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('x-api-key');

  if (!apiKey) {
    return res.status(401).json({ message: 'API key is missing' });
  }

  const key = await ApiKey.findOne({ key: apiKey });

  if (!key) {
    return res.status(403).json({ message: 'Invalid API key' });
  }

  req.body['businessId'] = key.businessId;

  next();
};

export default checkApiKey;
