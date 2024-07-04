import { Router } from 'express';
import 'express-async-errors';
import { schemaValidationMiddleware } from 'revisar-server-utils';
import { apiKeyController } from '../controllers/api-key.controller';
import { ICreateApiKeySchema } from 'shared-types';

/**
 * @swagger
 * api-keys:
 *   name: Api Keys
 *   description: Api keys for accessing the reviews receiver API
 */

const apiKeyRouter = Router();

/**
 * @swagger
 * /api-keys:
 *   post:
 *     tags:
 *       - Api Keys
 *     security:
 *       - bearerAuth: []
 *     summary: Generate a new API key
 *     responses:
 *       201:
 *        description: Successful operation
 *       500:
 *        description: Internal server error
 */
apiKeyRouter.post(
  '/',
  schemaValidationMiddleware({ body: ICreateApiKeySchema }),
  apiKeyController.generateApiKey.bind(apiKeyController)
);

/**
 * @swagger
 * /api-keys:
 *   delete:
 *     tags:
 *       - Api Keys
 *     security:
 */

export default apiKeyRouter;
