import { IClient, WeekdaysEnum } from 'shared-types';
import { metadata } from '../db';

/**
 * @swagger
 * components:
 *  schemas:
 *   CreateClient:
 *    type: object
 *    required:
 *     - email
 *     - fullName
 *     - businessName
 *     - businessDescription
 *     - password
 *    properties:
 *     email:
 *      type: string
 *      description: The email of the client
 *     fullName:
 *      type: string
 *      description: The full name of the client
 *     businessName:
 *      type: string
 *      description: The name of the business
 *     businessDescription:
 *      type: string
 *      description: The description of the business
 *     password:
 *      type: string
 *      description: The password of the client
 *    example:
 *     email: "user123@gmail.com"
 *     fullName: "John Doe"
 *     businessName: "John's Bakery"
 *     businessDescription: "A bakery that sells cakes and pastries"
 *     password: "password123"
 *
 *   Client:
 *    allOf:
 *     - $ref: '#/components/schemas/CreateClient'
 *     - type: object
 *       required:
 *        - businessId
 *       properties:
 *        businessId:
 *         type: string
 *         description: The unique identifier for the business
 *
 *   ClientTokens:
 *     type: object
 *     required:
 *       - accessToken
 *       - refreshToken
 *     properties:
 *       accessToken:
 *         type: string
 *         description: The access token for the client
 *       refreshToken:
 *         type: string
 *         description: The refresh token for the client
 *
 *   LoginClient:
 *     type: object
 *     required:
 *       - email
 *       - password
 *     properties:
 *       email:
 *         type: string
 *         description: The email of the client
 *       password:
 *         type: string
 *         description: The password of the client
 *     example:
 *       email: "user123@gmail.com"
 *       password: "password123"
 */
const clientSchema = new metadata.Schema<IClient>({
  email: { type: String, required: true, lowercase: true },
  fullName: { type: String, required: true, lowercase: true },
  businessName: { type: String },
  businessDescription: { type: String },
  businessId: { type: String, required: true },
  password: { type: String, required: true, maxlength: 1000 },
  tokens: [{ type: String }],
  actionsRefreshWeekday: { type: String, default: WeekdaysEnum.SUNDAY, enum: Object.values(WeekdaysEnum) },
});

export default metadata.model<IClient>('Clients', clientSchema);
