import { z } from 'zod';
import env from 'dotenv';

env.config();

const ConfigSchema = z.object({
  dbUrl: z.string(),
  dbName: z.string(),
  port: z.string(),
  topic: z.string(),
  brokers: z.string(),
  consumerGroup: z.string(),
  openaiApiKey: z.string(),
});

const config = ConfigSchema.parse({
  dbUrl: process.env.DB_URL,
  dbName: process.env.DB_NAME,
  port: process.env.PORT,
  topic: process.env.TOPIC,
  brokers: process.env.BROKERS,
  consumerGroup: process.env.CONSUMER_GROUP,
  openaiApiKey: process.env.OPENAI_API_KEY,
});

export default config;
