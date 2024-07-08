import { Router } from 'express';
import BatchController from '../controllers/batch.controller';
import checkApiKey from '../common/api-key.middleware';
import { IBatchReviewListSchema } from 'shared-types';
import { schemaValidationMiddleware } from 'revisar-server-utils/middlewares';

const batchRouter = Router();

/**
 * @swagger
 * /batch:
 *   post:
 *     tags:
 *       - Batch
 *     summary: Post a batch of reviews
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           reviews:
 *            type: array
 *            items:
 *             schema:
 *              type: object
 *              properties:
 *               value:
 *                type: string
 *                description: The text of the review
 *               date:
 *                type: string
 *                format: date-time
 *                description: The date the review was created
 *          example:
 *           reviews:
 *           - value: 'The AI analysis seems a bit hit-or-miss. Some of the insights were spot-on, but others felt off base. Also, the pricing seems a bit high for the current feature set.'
 *             date: '2021-09-01T00:00:00.000Z'
 *     responses:
 *       201:
 *         description: Successful operation
 *       401:
 *        description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 *     parameters:
 *      - name: x-api-key
 *        in: header
 *        required: true
 *        schema:
 *         type: string
 *        description: The API key
 *        example: '1c7ebe32457039cb2e98141e746e081d2a10282fd407e02e538ef72638955b08'
 */
batchRouter.post('/', checkApiKey, schemaValidationMiddleware({ body: IBatchReviewListSchema }), BatchController.post);

export default batchRouter;
