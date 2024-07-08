import { Mongoose } from 'mongoose';
import config from './config';
import initDB from 'revisar-server-utils/db';

export const datalake = new Mongoose();
export const connectDatalake = async () => initDB(config.datalakeDBUrl, config.datalakeDBName, datalake);
