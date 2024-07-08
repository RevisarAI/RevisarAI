import { z } from 'zod';
import env from 'dotenv';

env.config();

const ConfigSchema = z.object({
  accessTokenSecret: z.string(),
});

const config = ConfigSchema.parse({
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
});

export default config;
