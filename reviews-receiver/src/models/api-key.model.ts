import { datalake } from '../db'

/**
 * @swagger
 * components:
 *  schemas:
 *   ApiKey:
 *    type: object
 *    required:
 *     - key
 *     - businessId
 *     - createdAt
 *    properties:
 *     key:
 *      type: string
 *      description: The API key
 *     businessId:
 *      type: string
 *      description: The ID of the business that the API key is for
 *     createdAt:
 *      type: string
 *      description: The date the API key was created
 *    example:
 *     key: '1c7ebe32457039cb2e98141e746e081d2a10282fd407e02e538ef72638955b08'
 *     businessId: 'asdasdm324jnr2kjwnfs'
 *     createdAt: '2021-09-01T00:00:00.000Z'
 */

interface ApiKeyDocument extends Document {
  key: string
  businessId: string
  createdAt: Date
}

const apiKeySchema = new datalake.Schema<ApiKeyDocument>({
  key: { type: String, required: true, unique: true },
  businessId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

const ApiKey = datalake.model<ApiKeyDocument>('ApiKey', apiKeySchema)

export default ApiKey
