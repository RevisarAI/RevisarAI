import { ApiKeyMongooseSchema, IApiKey } from 'shared-types';
import { metadata } from '../db';
import { generateMongooseModel } from 'revisar-server-utils/db';

export default generateMongooseModel<IApiKey>(metadata, ApiKeyMongooseSchema);
