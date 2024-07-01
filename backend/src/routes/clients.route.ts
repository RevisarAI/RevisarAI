import { clientsController } from '../controllers/clients.controller';
import { Router } from 'express';

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Client API endpoints
 */
/**
 *  @swagger
 * components:
 *  schemas:
 *   BusinessInfo:
 *    type: object
 *    required:
 *     - accessToken
 *     - refreshToken
 *     - businessId
 *     - businessName
 *     - businessDescription
 *    properties:
 *     accessToken:
 *      type: string
 *      description: The JWT Access token
 *     refreshToken:
 *      type: string
 *      description: The JWT Refresh token
 *     businessId:
 *      type: string
 *      description: The business ID
 *     businessName:
 *      type: string
 *      description: The business' name
 *     businessDescription:
 *      type: string
 *      description: The business description
 *    example:
 *     accessToken: 'dsgsdgsgsdg'
 *     refreshToken: 'sdjanfklknnlnkmlds'
 *     businessId: '1'
 *     businessName: 'RevisarAI'
 *     businessDescription: 'Businesses AI platform'
 */
const router = Router();

/**
 * @swagger
 * paths:
 *   /api/clients/businesses:
 *     put:
 *       summary: Update client's info by business id
 *       tags: [Clients]
 *       security:
 *         - bearerAuth: []
 *       description: This endpoint allows the client to update his info by business id
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *             $ref: '#/components/schemas/BusinessInfo'
 *         responses:
 *           200:
 *             description: The client's details are updated, access and refresh tokens are returned
 */
router.put('/businesses', clientsController.updateByBusinessId.bind(clientsController));

export default router;