import { BaseController } from './base.controller';
import {
  IApiKey,
  IApiKeyMinimal,
  IApiKeyMinimalSchema,
  ICreateApiKey,
  ICreateApiKeyResponse,
  ICreateApiKeyResponseSchema,
  IRevokeApiKey,
} from 'shared-types';
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

  async getAll(req: AuthRequest<object, IApiKeyMinimal[]>, res: Response<IApiKeyMinimal[]>) {
    const { businessId } = req.user!;
    this.debug(`Getting all API keys for business ${businessId}`);

    const keys = await ApiKey.find({ businessId });
    const sanitizedKeys = keys.map((keyData) => IApiKeyMinimalSchema.parse(keyData));

    return res.status(httpStatus.OK).json(sanitizedKeys);
  }

  async generateApiKey(
    req: AuthRequest<object, ICreateApiKeyResponse, ICreateApiKey>,
    res: Response<ICreateApiKeyResponse>
  ) {
    const { businessId, email } = req.user!;
    const expiry = new Date(req.body.expiry || daysAhead(365));

    this.debug(`Generating API key for ${businessId} as requested by user mail "${email}"`);

    try {
      const plainApiKey = `${businessId}:${randomBytes(32).toString('hex')}`;
      const hashedApiKey = await hash(plainApiKey, 10);

      const newApiKey = await new ApiKey({ key: hashedApiKey, businessId, expiry, revoked: false }).save();
      return res.status(httpStatus.CREATED).json(ICreateApiKeyResponseSchema.parse({ ...newApiKey, key: plainApiKey }));
    } catch (err) {
      this.debug(
        `Error generating API key for ${businessId} as requested by user mail "${email}"`,
        (err as Error).message,
        (err as Error).stack || 'no stacktrace'
      );
      return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async revokeKey(req: AuthRequest<IRevokeApiKey, IApiKey>, res: Response) {
    const { businessId, email } = req.user!;
    const { id } = req.params;

    this.debug(`Revoking API key ${id} for ${businessId} as requested by user mail "${email}"`);

    try {
      const key = await ApiKey.findOneAndUpdate({ _id: id, businessId }, { revoked: true }, { new: true });
      if (!key) {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }

      this.debug(`Successfully revoked API key ${id} for ${businessId}`);
      return res.status(httpStatus.NO_CONTENT).json(IApiKeyMinimalSchema.parse(key));
    } catch (err) {
      this.debug(
        `Error revoking API key ${id} for ${businessId} as requested by user mail "${email}"`,
        (err as Error).message,
        (err as Error).stack || 'no stacktrace'
      );
      return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

export const apiKeyController = new ApiKeyController();
