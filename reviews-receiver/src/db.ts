import { Mongoose } from 'mongoose';
import config from './config';
import initDB from 'revisar-server-utils/db';

export const metadatadb = new Mongoose();

export const connectMetadatadb = async () => initDB(config.metadatadbDBUrl, config.metadatadbDBName, metadatadb);
