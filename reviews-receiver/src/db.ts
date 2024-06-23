import { Mongoose } from 'mongoose'
import createLogger from './utils/logger'
import config from './config'

const logger = createLogger('db')

const initDB = async (dbUrl: string, dbName: string, mongoose: Mongoose) => {
  const url = `mongodb://${dbUrl}/${dbName}`

  logger.debug(`Connecting to ${dbName} DB at ${url}`)

  mongoose.connection.on('error', (err) => logger.error(err))
  const { connection } = await mongoose.connect(url, {
    monitorCommands: true,
    retryWrites: true,
    writeConcern: {
      w: 'majority'
    }
  })

  logger.debug(`Successfully connected to ${dbName} DB`)

  // Attach log listener to every client event
  // see https://www.mongodb.com/docs/drivers/node/current/fundamentals/logging/

  const dbClient = connection.getClient()
  const replacer = (key: string, value: unknown) =>
    typeof value === 'bigint'
      ? value.toString() // convert BigInt to string
      : value // return everything else unchanged

  dbClient.addListener('commandStarted', (event) => logger.debug(JSON.stringify(event, replacer)))
  dbClient.addListener('commandSucceeded', (event) => logger.debug(JSON.stringify(event, replacer)))
  dbClient.addListener('commandFailed', (event) => logger.error(JSON.stringify(event, replacer)))
}

export const datalake = new Mongoose()

export const connectDatalake = async () => {
  await initDB(config.datalakeDBUrl, config.datalakeDBName, datalake)
}
