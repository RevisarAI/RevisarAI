import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import 'express-async-errors';

/**
 * @swagger
 * tags:
 *   name: Review
 *   description: Review API endpoints
 */

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     SentimentBarChartGroup:
 *       type: object
 *       required:
 *         - date
 *         - positive
 *         - negative
 *         - neutral
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the sentiment
 *         positive:
 *           type: number
 *           description: The number of positive reviews
 *         negative:
 *           type: number
 *           description: The number of negative reviews
 *         neutral:
 *           type: number
 *           description: The number of neutral reviews
 *       example:
 *         date: "2024-06-21"
 *         positive: 10
 *         negative: 5
 *         neutral: 3
 *
 *     WordFrequency:
 *       type: object
 *       required:
 *         - text
 *         - value
 *       properties:
 *         text:
 *           type: string
 *           description: The word
 *         value:
 *           type: number
 *           description: The frequency of the word
 *       example:
 *         text: "amazing"
 *         value: 10
 *
 *     PieChartData:
 *       type: object
 *       required:
 *         - id
 *         - label
 *         - value
 *       properties:
 *         id:
 *           type: number
 *           description: The unique identifier of the item in the chart
 *         label:
 *           type: string
 *           description: The label for the item
 *         value:
 *           type: number
 *           description: The value of the item
 *
 *
 *     BusinessAnalysis:
 *       type: object
 *       required:
 *         - sentimentOverTime
 *         - wordsFrequencies
 *         - dataSourceDistribution
 *       properties:
 *         sentimentOverTime:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SentimentBarChartGroup'
 *           description: The sentiment over time
 *         wordsFrequencies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WordFrequency'
 *           description: The most frequent words
 *         dataSourceDistribution:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PieChartData'
 *           description: The distribution of data sources
 */

/**
 * @swagger
 * paths:
 *   /api/reviews/analysis:
 *     get:
 *       summary: Get business analysis
 *       tags: [Review]
 *       security:
 *         - bearerAuth: []
 *       description: This endpoint returns the business analysis from the last week.
 *       responses:
 *         200:
 *           description: The business analysis from the last week
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/BusinessAnalysis'
 */
router.get('/analysis', reviewController.getAnalysis.bind(reviewController));

/**
 * @swagger
 * paths:
 *  /api/reviews/reply:
 *    post:
 *     summary: Generate response for review
 *     tags: [Review]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reviewText
 *               - prompt
 *               - previousReplies
 *             properties:
 *               reviewText:
 *                 type: string
 *                 description: The review text
 *                 example: "The food was amazing!"
 *               prompt:
 *                 type: string
 *                 description: The prompt for the response
 *                 example: "Make the review shorter and more formal"
 *               previousReplies:
 *                 type: array
 *                 description: The previous replies
 *                 items:
 *                   type: string
 *                 example: ["Thank you for your review!"]
 *     responses:
 *       200:
 *         description: The generated response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text:
 *                   type: string
 *                   description: The generated response
 *                   example: "Thank you for your review! We are glad you enjoyed the food!"
 *       500:
 *         description: Internal server error
 *
 *
 *
 */
router.post('/reply', reviewController.generateResponseForReview.bind(reviewController));

router.get('/', reviewController.getPaginated.bind(reviewController));

export default router;
