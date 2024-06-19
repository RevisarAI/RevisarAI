import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *  schemas:
 *   Review:
 *    type: object
 *    required:
 *     - businessId
 *     - value
 *     - date
 *    properties:
 *     businessId:
 *      type: string
 *      description: The ID of the business that the review is for
 *     value:
 *      type: string
 *      description: The text of the review
 *     date:
 *      type: string
 *      format: date-time
 *      description: The date the review was created
 *    example:
 *     businessId: 'asdasdm324jnr2kjwnfs'
 *     value: 'The AI analysis seems a bit hit-or-miss. Some of the insights were spot-on, but others felt off base. Also, the pricing seems a bit high for the current feature set.'
 *     date: '2021-09-01T00:00:00.000Z'
 */
export interface IReview {
  businessId: string;
  value: string;
  date: Date;
}

const reviewSchema = new mongoose.Schema<IReview>({
  businessId: { type: String, required: true },
  value: { type: String, required: true },
  date: { type: Date, required: true },
});

export default mongoose.model<IReview>("Review", reviewSchema);
