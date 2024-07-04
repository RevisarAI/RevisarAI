import { actionItemsController } from '../controllers/action-items.controller';
import { Router } from 'express';
import 'express-async-errors';

const actionItemsRouter = Router();

/**
 * @swagger
 * tags:
 *  name: Action Items
 *  description: Weekly action items for a business
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ActionItem:
 *       type: object
 *       required:
 *         - value
 *         - reason
 *         - isCompleted
 *       properties:
 *         value:
 *           type: string
 *           description: The action item
 *         reason:
 *           type: string
 *           description: The reason for the action item
 *         isCompleted:
 *           type: boolean
 *           description: Whether the action item is completed
 *       example:
 *         value: "Improve hotel restaurant opening dishes"
 *         reason: "7 reviews said they were not satisfied with the restaurant opening dishes"
 *         isCompleted: false
 *
 *     WeeklyActionItems:
 *       type: object
 *       required:
 *         - actionItems
 *         - date
 *         - businessId
 *       properties:
 *         actionItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ActionItem'
 *           description: The action items for the week
 *         date:
 *           type: string
 *           description: The date of action items generation
 *           example: "2021-07-01T00:00:00.000Z"
 *         businessId:
 *           type: string
 *           description: The business ID
 *           example: "60d9b1b3b2f3b4001f9b6b1b"
 *       example:
 *         actionItems:
 *           - value: "Improve hotel restaurant opening dishes"
 *             reason: "7 reviews said they were not satisfied with the restaurant opening dishes"
 *             isCompleted: false
 *         date: "2021-07-01T00:00:00.000Z"
 *         businessId: "60d9b1b3b2f3b4001f9b6b1b"
 */

/**
 * @swagger
 * paths:
 *   /api/action-items/:
 *     get:
 *       summary: Get the weekly action items for a business
 *       tags: [Action Items]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: The weekly action items
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/WeeklyActionItems'
 *         401:
 *           description: Unauthorized
 *         204:
 *           description: No content. No weekly action items found for user's business
 *         500:
 *           description: Internal Server Error
 */
actionItemsRouter.get('/', actionItemsController.getWeeklyActionItems.bind(actionItemsController));

export default actionItemsRouter;
