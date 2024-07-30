import { ApiKeyMongooseSchema, IApiKey } from 'shared-types';
import { generateMongooseModel } from 'revisar-server-utils/db';
import { metadata } from '../db';

export default generateMongooseModel<IApiKey>(metadata, ApiKeyMongooseSchema);
