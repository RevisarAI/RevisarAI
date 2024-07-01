import { Request, Response } from 'express';
import { FilterQuery, Model } from 'mongoose';
import { omit, pick } from 'lodash';
import httpStatus from 'http-status';
import createLogger from 'revisar-server-utils/logger';

const logger = createLogger('base controller');

export class BaseController<ModelType> {
  private loggerPrefix: string;

  constructor(public model: Model<ModelType>) {
    this.loggerPrefix = `model ${model.collection.name}:`;
  }

  debug(...msg: string[]) {
    logger.debug(`${this.loggerPrefix} ${msg.join(' ')}`);
  }

  private sanitizeObject(obj: object, ...exclude: string[]): FilterQuery<ModelType> | Partial<ModelType> {
    const allowed = pick(obj, Object.keys(this.model.schema.paths)) ?? {};

    const sanitized = omit(allowed, exclude);
    this.debug(`Sanitized: ${sanitized}`);
    return sanitized;
  }

  async get(req: Request, res: Response) {
    const query = this.sanitizeObject(req.query);
    this.debug(`Get`);
    const docs = await this.model.find(query);
    return res.status(httpStatus.OK).send(docs);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    this.debug(`Get by id ${id}`);
    const docs = await this.model.findById(id);
    return res.status(httpStatus.OK).send(docs);
  }

  async post(req: Request, res: Response) {
    this.debug(`Creating`); // Not logging body for security (passwords, private information etc...)
    const obj = await this.model.create(this.sanitizeObject(req.body));
    this.debug(`Created ${obj._id}`);
    return res.status(httpStatus.CREATED).send(obj);
  }

  async putById(req: Request, res: Response) {
    const { id } = req.params;
    this.debug(`Updating ${id}`);
    const updatePayload: Partial<ModelType> = this.sanitizeObject(req.body, '_id');
    const doc = await this.model.findById(id);

    if (!doc) {
      return res.status(httpStatus.NOT_FOUND).send('Document not found');
    }

    // Set the new values with this syntax to use `save` (for pre-save middleware)
    Object.keys(updatePayload).forEach((key) => {
      doc?.set(key, updatePayload[key as keyof ModelType]);
    });

    await doc?.save();
    return res.status(httpStatus.CREATED).send(doc);
  }

  async deleteById(req: Request, res: Response) {
    const { id } = req.params;
    this.debug(`Delete by id ${id}`);
    const doc = await this.model.findByIdAndDelete(id);
    return res.status(httpStatus.CREATED).send(doc);
  }
}

const createController = <ModelType>(model: Model<ModelType>) => new BaseController<ModelType>(model);

export default createController;
