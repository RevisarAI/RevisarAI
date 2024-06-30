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
 *
 *     IReview:
 *       type: object
 *       required:
 *         - _id
 *         - value
 *         - phrases
 *         - date
 *         - businessId
 *         - sentiment
 *         - rating
 *         - dataSource
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the review
 *         value:
 *           type: string
 *           description: The review text
 *         phrases:
 *           type: array
 *           items:
 *             type: string
 *             description: The phrase extracted from the review
 *           description: The phrases extracted from the review
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the review
 *         businessId:
 *           type: string
 *           description: The unique identifier of the business
 *         sentiment:
 *           type: string
 *           description: The sentiment of the review
 *         rating:
 *           type: number
 *           description: The rating of the review
 *         dataSource:
 *           type: string
 *           description: The data source of the review
 *
 *
 *     IGetAllReviewsResponse:
 *       type: object
 *       required:
 *         - currentPage
 *         - totalReviews
 *         - reviews
 *       properties:
 *         currentPage:
 *           type: number
 *           description: The current page
 *         totalReviews:
 *           type: number
 *           description: The total number of reviews
 *         reviews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/IReview'
 *           description: The reviews
 *
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

// TODO: add swagger and document this route
router.post('/reply', reviewController.generateResponseForReview.bind(reviewController));

/**
 * @swagger
 * paths:
 *   /api/reviews:
 *     get:
 *       summary: Get reviews
 *       tags: [Review]
 *       security:
 *         - bearerAuth: []
 *       description: This endpoint returns the reviews paginated.
 *       parameters:
 *         - in: query
 *           name: page
 *           schema:
 *             type: number
 *           description: The page number
 *         - in: query
 *           name: limit
 *           schema:
 *             type: number
 *           description: The number of items per page
 *         - in: query
 *           name: before
 *           schema:
 *             type: string
 *             format: date
 *           description: The date before which the reviews were created
 *         - in: query
 *           name: search
 *           schema:
 *             type: string
 *           description: The search query
 *       responses:
 *         200:
 *           description: The reviews paginated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/IGetAllReviewsResponse'
 *         500:
 *           description: Internal Server Error
 *
 */
router.get('/', reviewController.getPaginated.bind(reviewController));

export default router;
