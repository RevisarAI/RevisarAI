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
 * components:
 *   schemas:
 *     ApiKey:
 *       type: object
 *       required:
 *         - _id
 *         - expiry
 *         - revoked
 *         - createdAt
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the API key
 *           example: 5f9d7b3b1c9d440000f1b4b3
 *         expiry:
 *           type: string
 *           description: The expiry date of the API key
 *           example: 2020-11-01T00:00:00.000Z
 *         revoked:
 *           type: boolean
 *           description: Whether the API key has been revoked
 *           example: false
 *         createdAt:
 *           type: string
 *           description: The date the API key was created
 *           example: 2020-11-01T00:00:00.000Z
 *       example:
 *         _id: 5f9d7b3b1c9d440000f1b4b3
 *         expiry: 2020-11-01T00:00:00.000Z
 *         revoked: false
 *         createdAt: 2020-11-01T00:00:00.000Z
 *     CreateApiKey:
 *       type: object
 *       properties:
 *         expiry:
 *           type: string
 *           description: The expiry date of the API key
 *           example: 2020-11-01T00:00:00.000Z
 *       example:
 *         expiry: 2020-11-01T00:00:00.000Z
 *
 */

/**
 * @swagger
 * /api/api-keys:
 *  get:
 *    tags:
 *      - Api Keys
 *    security:
 *      - bearerAuth: []
 *    summary: Get all business API keys
 *    responses:
 *      200:
 *        description: Successful operation
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/ApiKey'
 *      500:
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/api-keys:
 *   post:
 *     tags:
 *       - Api Keys
 *     security:
 *       - bearerAuth: []
 *     summary: Generate a new API key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateApiKey'
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
 * /api/api-keys/{id}:
 *   delete:
 *     tags:
 *       - Api Keys
 *     security:
 *       - bearerAuth: []
 *     summary: Revoke API key
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Successful operation
 *       404:
 *         description: API key not found for given id
 *       500:
 *         description: Internal server error
 */
apiKeyRouter.delete('/:id', apiKeyController.revokeKey.bind(apiKeyController));

export default apiKeyRouter;
