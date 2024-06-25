import { z } from 'zod';
import env from 'dotenv';

env.config();

const ConfigSchema = z.object({
  metadatadbDBUrl: z.string(),
  metadatadbDBName: z.string(),
  port: z.string(),
});

const config = ConfigSchema.parse({
  metadatadbDBUrl: process.env.METADATADB_DB_URL,
  metadatadbDBName: process.env.METADATADB_DB_NAME,
  port: process.env.PORT,
});

export default config;
