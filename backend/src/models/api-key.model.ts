import { ApiKeyMongooseSchema, IApiKey } from 'shared-types';
import { metadata } from '../db';

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

const apiKeySchema = new metadata.Schema<IApiKey>(ApiKeyMongooseSchema.schema);

const ApiKey = metadata.model<IApiKey>(ApiKeyMongooseSchema.name, apiKeySchema);

export default ApiKey;
