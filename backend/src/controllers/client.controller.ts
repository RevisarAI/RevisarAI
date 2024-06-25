import { IClient } from "shared-types";
import { BaseController } from "./base.controller";
import clientModel from "../models/client.model";

class ClientsController extends BaseController<IClient> {
  constructor() {
    super(clientModel);
  }
}

export const clientsController = new ClientsController();