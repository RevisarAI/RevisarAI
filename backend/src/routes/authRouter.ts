import { Router } from "express";
import authController from "../controllers/authController";
import registrationMiddleware from "../middlewares/registrationMiddleware";
import loginMiddleware from "../middlewares/loginMiddleware";

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
authRouter.post("/register", registrationMiddleware, authController.register);

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
authRouter.post("/login", loginMiddleware, authController.login);

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
authRouter.get("/refresh", authController.refresh);

export default authRouter;
