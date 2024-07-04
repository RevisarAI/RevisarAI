import { BaseController } from './base.controller';
import { IApiKey, ICreateApiKey, ICreateApiKeyResponse, ICreateApiKeyResponseSchema } from 'shared-types';
import { Response } from 'express';
import { randomBytes } from 'crypto';
import { hash } from 'bcrypt';
import ApiKey from '../models/api-key.model';
import { AuthRequest } from '../common/auth.middleware';
import { daysAhead } from '../utils/date';
import httpStatus from 'http-status';

class ApiKeyController extends BaseController<IApiKey> {
  constructor() {
    super(ApiKey);
  }

  async generateApiKey(
    req: AuthRequest<object, ICreateApiKeyResponse, ICreateApiKey>,
    res: Response<ICreateApiKeyResponse>
  ) {
    const { businessId, email } = req.user!;
    const expiry = req.body.expiry || daysAhead(365);

    this.debug(`Generating API key for ${businessId} as requested by user mail "${email}"`);

    try {
      const plainApiKey = randomBytes(32).toString('hex');
      const hashedApiKey = await hash(plainApiKey, 10);

      const newApiKey = new ApiKey({ key: hashedApiKey, businessId, expiry, revoked: false });
      await newApiKey.save();
      return res.status(httpStatus.CREATED).json(ICreateApiKeyResponseSchema.parse({ ...newApiKey, key: plainApiKey }));
    } catch (err) {
      this.debug(
        `Error generating API key for ${businessId} as requested by user mail "${email}"`,
        (err as Error).message,
        (err as Error).stack || 'no stacktrace'
      );
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}

export const apiKeyController = new ApiKeyController();
