import { clientsController } from '../controllers/clients.controller';
import { Router } from 'express';

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Client API endpoints
 */

const router = Router();

/**
 * @swagger
 * paths:
 *   /api/clients/businesses:
 *     put:
 *       summary: Update client's info by business id
 *       tags: [Client]
 *       security:
 *         - bearerAuth: []
 *       description: This endpoint allows the client to update his info by business id
 *       responses:
 *         200:
 *           description: The client's details are updated 
 */
router.put('/businesses', clientsController.updateByBusinessId.bind(clientsController));

export default router;
