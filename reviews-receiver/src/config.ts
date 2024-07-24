import { z } from 'zod';
import env from 'dotenv';

env.config();

const ConfigSchema = z.object({
  metadataDBUrl: z.string(),
  metadataDBName: z.string(),
  port: z.string(),
  accessTokenSecret: z.string(),
  topic: z.string(),
  kafkaBrokers: z.string(),
});

const config = ConfigSchema.parse({
  metadataDBUrl: process.env.METADATA_DB_URL,
  metadataDBName: process.env.METADATA_DB_NAME,
  port: process.env.PORT,
  kafkaBrokers: process.env.KAFKA_BROKERS,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  topic: process.env.TOPIC,
});

export default config;
