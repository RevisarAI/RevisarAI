import { Router } from 'express';
import authController from '../controllers/authController';
import registrationMiddleware from '../middlewares/registrationMiddleware';

const authRouter = Router();

/**
 * @swagger
 * paths:
 *  /auth/register:
 *    post:
 *      summary: Register a new client
 *      description: This endpoint registers a new client.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateClient'
 *      responses:
 *        201:
 *          description: Client registered successfully.
 *          content:
 *            application/json:
 *              schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ClientTokens'
 *                 - type: object
 *                   properties:
 *                     businessId:
 *                       type: string
 *                       description: The ID of the business
 *        400:
 *          description: Email already exists.
 *        500:
 *          description: Internal server error while registering the user.
 */
authRouter.post('/register', registrationMiddleware, authController.register);

export default authRouter;
