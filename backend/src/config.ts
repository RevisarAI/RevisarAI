import { z } from 'zod';
import env from 'dotenv';

env.config();

const ConfigSchema = z.object({
  datalakeDBUrl: z.string(),
  metadataDBUrl: z.string(),
  port: z.string(),
  refreshTokenSecret: z.string(),
  accessTokenSecret: z.string(),
  accessTokenExpiration: z.string(),
  googleClientID: z.string(),
});

const config = ConfigSchema.parse({
  datalakeDBUrl: process.env.DATALAKE_DB_URL,
  metadataDBUrl: process.env.METADATA_DB_URL,
  port: process.env.PORT,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
  googleClientID: process.env.GOOGLE_CLIENT_ID,
});

export default config;
