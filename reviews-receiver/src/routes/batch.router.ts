import { Router } from 'express';
import BatchController from '../controllers/batch.controller';
import checkApiKey from '../common/api-key.middleware';
import { IBatchReviewListSchema } from 'shared-types';
import { schemaValidationMiddleware } from 'revisar-server-utils/middlewares';
import { authMiddleware } from 'revisar-server-utils';
import config from '../config';

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     IBatchReview:
 *       type: object
 *       required:
 *         - value
 *         - date
 *       properties:
 *         value:
 *           type: string
 *           description: The review text
 *           example: 'The AI analysis seems a bit hit-or-miss. Some of the insights were spot-on, but others felt off base. Also, the pricing seems a bit high for the current feature set.'
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the review
 *           example: '2024-07-06T18:15:23Z'
 *       example:
 *         value: 'The AI analysis seems a bit hit-or-miss. Some of the insights were spot-on, but others felt off base. Also, the pricing seems a bit high for the current feature set.'
 *         date: '2024-07-06T18:15:23Z'
 */

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
 *              $ref: '#/components/schemas/IBatchReview'
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

/**
 * @swagger
 * /batch/user-interface:
 *   post:
 *     tags:
 *       - Batch
 *     summary: Post a batch of reviews from user interface
 *     security:
 *         - bearerAuth: []
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - reviews
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/IBatchReview'
 *     responses:
 *       200:
 *         description: The reviews were uploaded successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *           description: Internal Server Error.
 */
batchRouter.post('/user-interface', authMiddleware(config.accessTokenSecret), BatchController.postFromUserInterface);

export default batchRouter;
