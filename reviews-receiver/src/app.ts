import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import apiKeyRouter from './routes/api-key.router';
import batchRouter from './routes/batch.router';
import { connectMetadata } from './db';

const app = express();

const initApp = async () => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/batch', batchRouter);
  app.use('/keys', apiKeyRouter);

  await connectMetadata();

  const swaggerOptions: swaggerJsDoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Reviews Receiver API',
        description: 'This is the API for Reviews Receiver service',
        version: '1.0.0',
      },
    },
    apis: ['./src/routes/*.ts', './src/models/*.ts'],
  };

  const specs = swaggerJsDoc(swaggerOptions);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

  return app;
};

export default initApp;
