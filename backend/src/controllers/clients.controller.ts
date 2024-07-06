import { Response } from 'express';
import { AuthRequest } from 'revisar-server-utils';
import { IBusinessProfile, IClient } from "shared-types";
import { BaseController } from "./base.controller";
import clientModel from "../models/client.model";
import httpStatus from 'http-status';
import { isEmpty } from 'lodash';
import { signTokens } from '../utils/tokens';

class ClientsController extends BaseController<IClient> {
  constructor() {
    super(clientModel);
  }

  async updateByBusinessId(req: AuthRequest, res: Response){
    const businessId = req.user?.businessId;
    this.debug(`Updating by bid - ${businessId}`);

    const client = await this.model.findOne({'businessId': businessId});
    if (!client) {
      return res.status(httpStatus.NOT_FOUND).send('Document not found');
    }
    
    Object.keys(req.body).forEach(f => {
      client.set(f, req.body[f]);
    });

    const { accessToken, refreshToken } = await signTokens(client);
    if (client.tokens == null) {
      client.tokens = [refreshToken];
    } else {
      client.tokens.push(refreshToken);
    }

    await client.save();
    return res.status(httpStatus.OK).send({ accessToken, refreshToken });
  }
}

export const clientsController = new ClientsController();