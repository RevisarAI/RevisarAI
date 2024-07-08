import { ApiKeyMongooseSchema, IApiKey } from 'shared-types';
import { metadataDb } from '../db';

const apiKeySchema = new metadataDb.Schema<IApiKey>(ApiKeyMongooseSchema.schema);

const ApiKey = metadataDb.model<IApiKey>(ApiKeyMongooseSchema.name, apiKeySchema);

export default ApiKey;
