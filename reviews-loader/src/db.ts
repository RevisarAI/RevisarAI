import { Mongoose } from 'mongoose';
import initDB from 'revisar-server-utils/db';
import config from './config';

export const datalake = new Mongoose();

export const connectDatalake = async () => initDB(config.datalakeDBUrl, config.datalakeDBName, datalake);
