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
 *   /api/clients/:
 *     put:
 *       summary: Update client's info
 *       tags: [Client]
 *       security:
 *         - bearerAuth: []
 *       description: This endpoint allows the client to update his info
 *       responses:
 *         200:
 *           description: The client's details are updated 
 */
router.put('/', clientsController.putById.bind(clientsController));

export default router;
