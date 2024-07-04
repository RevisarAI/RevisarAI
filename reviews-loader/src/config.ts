import { z } from 'zod';
import env from 'dotenv';

env.config();

const ConfigSchema = z.object({
  datalakeDBUrl: z.string(),
  datalakeDBName: z.string(),
  port: z.string(),
  topic: z.string(),
  kafkaBrokers: z.string(),
  consumerGroup: z.string(),
  openaiApiKey: z.string(),
});

const config = ConfigSchema.parse({
  datalakeDBUrl: process.env.DATALAKE_DB_URL,
  datalakeDBName: process.env.DATALAKE_DB_NAME,
  port: process.env.PORT,
  topic: process.env.TOPIC,
  kafkaBrokers: process.env.KAFKA_BROKERS,
  consumerGroup: process.env.CONSUMER_GROUP,
  openaiApiKey: process.env.OPENAI_API_KEY,
});

export default config;
