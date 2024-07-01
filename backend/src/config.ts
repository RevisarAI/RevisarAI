import { z } from 'zod';
import env from 'dotenv';

env.config();

const ConfigSchema = z.object({
  datalakeDBUrl: z.string(),
  datalakeDBName: z.string(),
  metadataDBUrl: z.string(),
  metadataDBName: z.string(),
  port: z.string(),
  refreshTokenSecret: z.string(),
  accessTokenSecret: z.string(),
  accessTokenExpiration: z.string(),
  googleClientID: z.string(),
  openaiApiKey: z.string(),
});

const config = ConfigSchema.parse({
  datalakeDBUrl: process.env.DATALAKE_DB_URL,
  datalakeDBName: process.env.DATALAKE_DB_NAME,
  metadataDBUrl: process.env.METADATA_DB_URL,
  metadataDBName: process.env.METADATA_DB_NAME,
  port: process.env.PORT,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  openaiApiKey: process.env.OPENAI_API_KEY,
});

export default config;
