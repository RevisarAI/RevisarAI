import cors from 'cors';
import express, { Express } from 'express';
import dotenv from 'dotenv';
import createLogger from 'revisar-server-utils/logger';
import { connectDatalake } from './db';
import initConsumer from './consumer';
import healthRoute from './routes/health.route';
import 'express-async-errors';

const logger = createLogger('app');

dotenv.config();

const initApp = async (): Promise<Express> => {
  const app: Express = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

  app.use(healthRoute);

  logger.info('calling init DB');
  await connectDatalake();

  logger.info('calling init consumer');
  await initConsumer();

  return app;
};

export default initApp;
