import { IReview, ReviewMongoseSchema } from 'shared-types';
import { datalake } from '../db';

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - value
 *         - date
 *         - businessId
 *         - sentiment
 *         - rating
 *         - phrases
 *         - dataSource
 *       properties:
 *         value:
 *           type: string
 *           description: The review text
 *         date:
 *           type: string
 *           format: date
 *           description: The date the review was created
 *         businessId:
 *           type: string
 *           description: The unique identifier for the business
 *         sentiment:
 *           type: string
 *           description: The sentiment of the review
 *         rating:
 *           type: number
 *           description: The rating of the review
 *         phrases:
 *           type: array
 *           items:
 *             type: string
 *           description: The phrases extracted from the review
 *         dataSource:
 *           type: string
 *           description: The source of the review
 *       example:
 *         value: "The food was amazing!"
 *         date: "2024-06-21"
 *         businessId: "123456"
 *         sentiment: "positive"
 *         rating: 10
 *         phrases: ["amazing"]
 *         dataSource: "google"
 */
const reviewSchema = new datalake.Schema<IReview>(ReviewMongoseSchema.schema);

export default datalake.model<IReview>(ReviewMongoseSchema.name, reviewSchema);
