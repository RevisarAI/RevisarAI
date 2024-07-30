import { IMongooseSchemaConfig } from 'shared-types/db';
import createLogger from './logger';
import { Model, Mongoose } from 'mongoose';

const logger = createLogger('db');

export const generateMongooseModel = <T>(db: Mongoose, config: IMongooseSchemaConfig<T>): Model<T> => {
  logger.info(`Creating schema and model "${config.name}"`);

  const schema = new db.Schema(config.schema);

  config.indexes?.forEach(({ index, options }) => {
    schema.index(index, options);
  });

  return db.model<T>(config.name, schema);
};

export default async (dbUrl: string, dbName: string, mongoose: Mongoose) => {
  const url = `mongodb://${dbUrl}/${dbName}`;

  logger.debug(`Connecting to ${dbName} DB at ${url}`);

  mongoose.connection.on('error', (err) => logger.error(err));
  const { connection } = await mongoose.connect(url, {
    monitorCommands: true,
    retryWrites: true,
    writeConcern: {
      w: 'majority',
    },
  });

  logger.debug(`Successfully connected to ${dbName} DB`);

  // Attach log listener to every client event
  // see https://www.mongodb.com/docs/drivers/node/current/fundamentals/logging/

  const dbClient = connection.getClient();
  const replacer = (key: string, value: unknown) =>
    typeof value === 'bigint'
      ? value.toString() // convert BigInt to string
      : value; // return everything else unchanged

  dbClient.addListener('commandStarted', (event) => logger.debug(JSON.stringify(event, replacer)));
  dbClient.addListener('commandSucceeded', (event) => logger.debug(JSON.stringify(event, replacer)));
  dbClient.addListener('commandFailed', (event) => logger.error(JSON.stringify(event, replacer)));
};
