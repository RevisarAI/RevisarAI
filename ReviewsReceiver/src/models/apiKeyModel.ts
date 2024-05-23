import mongoose, { Document, Schema } from 'mongoose';

interface ApiKeyDocument extends Document {
  key: string;
  businessId: string;
  createdAt: Date;
}

const apiKeySchema = new Schema<ApiKeyDocument>({
  key: { type: String, required: true, unique: true },
  businessId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ApiKey = mongoose.model<ApiKeyDocument>('ApiKey', apiKeySchema);

export default ApiKey;