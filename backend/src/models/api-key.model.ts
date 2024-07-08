import { ApiKeyMongooseSchema, IApiKey } from 'shared-types';
import { metadata } from '../db';

const apiKeySchema = new metadata.Schema<IApiKey>(ApiKeyMongooseSchema.schema);

const ApiKey = metadata.model<IApiKey>(ApiKeyMongooseSchema.name, apiKeySchema);

export default ApiKey;
