import { Router } from 'express';
import BatchController from '../controllers/batchController';
import checkApiKey from '../common/apiKeyMiddleware';

const batchRouter = Router();

batchRouter.post('/', checkApiKey, BatchController.post.bind(BatchController));

export default batchRouter;