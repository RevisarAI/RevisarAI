import { Model } from "mongoose";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

export class BaseConstroller<ModelType> {
  model: Model<ModelType>;
  getPosts: (req: Request, res: Response) => Promise<void>;
  getComments: (req: Request, res: Response) => Promise<void>;

  constructor(model: Model<ModelType>) {
    this.model = model;
  }

  async post(req: Request, res: Response) {
    try {
      const object = await this.model.create(req.body);
      res.status(StatusCodes.CREATED).json(object);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const result = await this.model.find();
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const object = await this.model.findById(req.params.id);
      if (!object) {
        res.status(StatusCodes.NOT_FOUND).send();
      }
      res.send(object);
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  async deleteById(req: Request, res: Response) {
    try {
      const object = await this.model.findByIdAndDelete(req.params.id);
      if (!object) {
        res.status(StatusCodes.NOT_FOUND).send();
      }
      res.send(object);
    } catch (err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  async updateById(req: Request, res: Response) {
    try {
      const object = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!object) {
        res.status(StatusCodes.NOT_FOUND).send();
      }
      res.send(object);
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }
}

const createController = <ModelType>(model: Model<ModelType>) => {
  return new BaseConstroller<ModelType>(model);
};

export default createController;
