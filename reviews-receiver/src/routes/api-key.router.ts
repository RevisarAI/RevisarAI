import { Router } from 'express'
import ApiKey from '../models/api-key.model'
import crypto from 'crypto'
import { Request, Response } from 'express'

const apiKeyRouter = Router()

/**
 * @swagger
 * /keys:
 *   post:
 *     tags:
 *       - Keys
 *     summary: Generate a new API key
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           businessId:
 *            type: string
 *            description: The ID of the business
 *          example:
 *           businessId: 'asdasdm324jnr2kjwnfsdd'
 *
 *     responses:
 *       201:
 *         description: Successful operation
 *       400:
 *        description: Bad request
 *       500:
 *        description: Internal server error
 *
 */

// TODO: set up the route to generate a new API key in seperate service

apiKeyRouter.post('/', async (req: Request, res: Response) => {
  const { businessId } = req.body

  if (!businessId) {
    res.status(400).json({ message: 'businessId is required' })
    return
  }

  try {
    const apiKey = crypto.randomBytes(32).toString('hex')

    const newApiKey = new ApiKey({ key: apiKey, businessId })
    await newApiKey.save()
    res.status(201).json({ apiKey })
  } catch (err) {
    res.status(500).send({ message: 'Internal server error' })
  }
})

export default apiKeyRouter
