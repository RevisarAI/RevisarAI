import initApp from './app';
import config from './config';
import { Express } from 'express';
import { createServer } from 'revisar-server-utils';

initApp().then((app: Express) => createServer(app, config.port, 'Reviews Receiver'));
