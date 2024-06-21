import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *  schemas:
 *   Client:
 *    type: object
 *    required:
 *     - email
 *     - fullName
 *     - businessName
 *     - businessDescription
 *     - businessId
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
 *     businessId:
 *      type: string
 *      description: The ID of the business
 *     password:
 *      type: string
 *      description: The password of the client
 *    example:
 *     email: "user123@gmail.com"
 *     fullName: "John Doe"
 *     businessName: "John's Bakery"
 *     businessDescription: "A bakery that sells cakes and pastries"
 *     businessId: "123456"
 *     password: "password123"
 */

export interface IClient {
  email: string;
  fullName: string;
  businessName: string;
  businessDescription: string;
  businessId: string;
  password: string;
  tokens?: string[];
}

const clientSchema = new mongoose.Schema<IClient>({
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  businessName: { type: String, required: true },
  businessDescription: { type: String, required: true },
  businessId: { type: String, required: true },
  password: { type: String, required: true, maxlength: 1000 },
  tokens: [{ type: String }]
});

export default mongoose.model<IClient>("Clients", clientSchema);
