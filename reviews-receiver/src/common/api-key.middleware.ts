import { Request, Response, NextFunction } from 'express'
import ApiKey from '../models/api-key.model'

const checkApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('x-api-key')

  if (!apiKey) {
    res.status(401).json({ message: 'API key is missing' })
    return
  }

  const key = await ApiKey.findOne({ key: apiKey })

  if (!key) {
    res.status(403).json({ message: 'Invalid API key' })
    return
  }

  req.body['businessId'] = key.businessId

  next()
}

export default checkApiKey
