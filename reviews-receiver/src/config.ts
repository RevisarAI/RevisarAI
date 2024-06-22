import { z } from 'zod'
import env from 'dotenv'

env.config()

const ConfigSchema = z.object({
  datalakeDBUrl: z.string(),
  datalakeDBName: z.string(),
  port: z.string()
})

const config = ConfigSchema.parse({
  datalakeDBUrl: process.env.DATALAKE_DB_URL,
  datalakeDBName: process.env.DATALAKE_DB_NAME,
  port: process.env.PORT
})

export default config
