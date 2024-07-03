import { Express } from 'express';
import http from 'http';
import https from 'https';
import { readFileSync } from 'fs';
import createLogger from './logger';

const logger = createLogger('Express');

export const createServer = (app: Express, port: string, serviceName: string = 'Service') => {
  logger.debug(`Running in ${process.env.NODE_ENV} mode`);

  if (process.env.NODE_ENV !== 'production') {
    http.createServer(app).listen(port);
  } else {
    const httpsConf = {
      key: readFileSync(`${__dirname}/../client-key.pem`),
      cert: readFileSync(`${__dirname}/../client-cert.pem`),
    };

    https.createServer(httpsConf, app).listen(port);
  }

  logger.debug(`${serviceName} is listening on port ${port}`);
};
