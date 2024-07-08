import { ApiKeyMongooseSchema, IApiKey } from 'shared-types';
import { metadataDb } from '../db';
import { generateMongooseModel } from 'revisar-server-utils/db';

export default generateMongooseModel<IApiKey>(metadataDb, ApiKeyMongooseSchema);
