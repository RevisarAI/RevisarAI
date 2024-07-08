import { Mongoose } from 'mongoose';
import config from './config';
import initDB from 'revisar-server-utils/db';

export const metadataDb = new Mongoose();

export const connectMetadataDb = async () => initDB(config.metadataDBUrl, config.metadataDBName, metadataDb);
