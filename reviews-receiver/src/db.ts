import { Mongoose } from 'mongoose';
import config from './config';
import initDB from 'revisar-server-utils/db';

export const metadata = new Mongoose();

export const connectMetadata = async () => initDB(config.metadataDBUrl, config.metadataDBName, metadata);
