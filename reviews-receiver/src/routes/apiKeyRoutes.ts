import { Router } from "express";
import ApiKey from "../models/apiKeyModel";
import crypto from "crypto";

const apiKeyRouter = Router();

/**
 * @swagger
 * /keys:
 *   post:
 *     tags:
 *       - Keys
 *     summary: Generate a new API key
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           businessId:
 *            type: string
 *            description: The ID of the business 
 *          example:
 *           businessId: 'asdasdm324jnr2kjwnfsdd'
 *            
 *     responses:
 *       201:
 *         description: Successful operation
 *       400:
 *        description: Bad request
 */

// TODO: set up the route to generate a new API key in seperate service

apiKeyRouter.post("/", async (req, res) => {
  const { businessId } = req.body;

  if (!businessId) {
    return res.status(400).json({ message: "businessId is required" });
  }

  const apiKey = crypto.randomBytes(32).toString("hex");

  const newApiKey = new ApiKey({ key: apiKey, businessId });
  await newApiKey.save();

  res.status(201).json({ apiKey });
});

export default apiKeyRouter;
