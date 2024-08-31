import { ApiKeyMongooseSchema, IApiKey } from 'shared-types';
import { generateMongooseModel } from 'revisar-server-utils/db';
import { metadataDb } from '../db';

export default generateMongooseModel<IApiKey>(metadataDb, ApiKeyMongooseSchema);
