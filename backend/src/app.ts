import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRouter from './routes/auth.router';
import { connectDatalake, connectMetadata } from './db';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

const initApp = async () => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/auth', authRouter);

  await Promise.all([connectDatalake(), connectMetadata()]);

  const swaggerOptions: swaggerJsDoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'RevisarAI backend API',
        description: 'This is the API for RevisarAI backend service',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    apis: ['./src/routes/*.ts', './src/models/*.ts'],
  };

  const specs = swaggerJsDoc(swaggerOptions);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

  return app;
};

export default initApp;
