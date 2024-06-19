import { Router } from 'express';
import ApiKey from '../models/apiKeyModel';
import crypto from 'crypto';

const apiKeyRouter = Router();

// TODO: set up the route to generate a new API key in seperate service

apiKeyRouter.post('/', async (req, res) => {
  const { businessId } = req.body;

  if (!businessId) {
    return res.status(400).json({ message: 'businessId is required' });
  }

  const apiKey = crypto.randomBytes(32).toString('hex');
  
  const newApiKey = new ApiKey({ key: apiKey, businessId });
  await newApiKey.save();

  res.status(201).json({ apiKey });
});

export default apiKeyRouter;
