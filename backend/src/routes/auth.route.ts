import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { schemaValidationMiddleware } from 'revisar-server-utils/middlewares';
import { ICreateUserSchema, ILoginFormDataSchema } from 'shared-types';
import authMiddleware from '../common/auth.middleware';
import 'express-async-errors';

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Authentification API endpoints
 */
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
 *  schemas:
 *   Token:
 *    type: object
 *    required:
 *     - accessToken
 *     - refreshToken
 *    properties:
 *     accessToken:
 *      type: string
 *      description: The JWT Access token
 *     refreshToken:
 *      type: string
 *      description: The JWT Refresh token
 *    example:
 *     accessToken: 'dsgsdgsgsdg'
 *     refreshToken: 'sdjanfklknnlnkmlds'
 */
const authRouter = Router();

/**
 * @swagger
 * paths:
 *  /auth/register:
 *    post:
 *      summary: Register a new client
 *      tags: [Auth]
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
 *                - $ref: '#/components/schemas/ClientTokens'
 *        400:
 *          description: Email already exists.
 *        500:
 *          description: Internal server error while registering the user.
 */
authRouter.post('/register', schemaValidationMiddleware({ body: ICreateUserSchema }), authController.register);

/**
 * @swagger
 * paths:
 *  /auth/login:
 *    post:
 *      summary: Login a client
 *      tags: [Auth]
 *      description: This endpoint logs in a client.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginClient'
 *      responses:
 *        200:
 *          description: Client logged in successfully.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ClientTokens'
 *        400:
 *          description: Bad email or password.
 */
authRouter.post('/login', schemaValidationMiddleware({ body: ILoginFormDataSchema }), authController.login);

/**
 * @swagger
 * /auth/refresh:
 *  get:
 *   summary: get a new access token using the refresh token
 *   tags: [Auth]
 *   description: need to provide the refresh token in the auth header
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: The acess & refresh tokens
 *     content:
 *      application/json:
 *       schema:
 *         $ref: '#/components/schemas/Token'
 */
authRouter.get('/refresh', authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *  get:
 *   summary: logs out a user
 *   tags: [Auth]
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: logout completed successfully
 *    500:
 *     description: Internal server error while logging out the user
 */
authRouter.get('/logout', authController.logout);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: signs in a user with google sign in
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - credentials
 *             properties:
 *               credentials:
 *                 type: string
 *             example:
 *               credentials: fhsd7nf78yno24nfoagh87wyn4f
 *     responses:
 *       400:
 *         description: Invalid credentials or google app permissions
 *       200:
 *         description: The new user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 */
authRouter.post('/google', authController.googleSignIn);

/**
 * @swagger
 * /auth/google/:
 *   put:
 *     summary: provide additional details for a user first google sign in
 *     tags: [auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *         type: object
 *         required:
 *          - businessName
 *          - businessDescription
 *         properties:
 *          businessName:
 *           type: string
 *           description: The name of the business
 *          businessDescription:
 *           type: string
 *           description: The description of the business
 *         example:
 *          businessName: "John's Bakery"
 *          businessDescription: "A bakery that sells cakes and pastries"
 */
authRouter.put(
  '/google',
  authMiddleware,
  schemaValidationMiddleware({ body: ICreateUserSchema.pick({ businessName: true, businessDescription: true }) }),
  authController.googleAdditionalDetails
);

export default authRouter;
