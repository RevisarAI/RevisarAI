import { z } from 'zod';
import env from 'dotenv';

env.config();

const ConfigSchema = z.object({
  metadatadbDBUrl: z.string(),
  metadatadbDBName: z.string(),
  port: z.string(),
  kafka_brokers: z.string().optional(),
  accessTokenSecret: z.string(),
});

const config = ConfigSchema.parse({
  metadatadbDBUrl: process.env.METADATADB_DB_URL,
  metadatadbDBName: process.env.METADATADB_DB_NAME,
  port: process.env.PORT,
  kafka_brokers: process.env.KAFKA_BROKERS,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
});

export default config;
