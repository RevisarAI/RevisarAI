import { Express } from 'express';
import initApp from './app';
import { createServer } from 'revisar-server-utils/server';
import config from './config';

initApp().then((app: Express) => createServer(app, config.port, 'Action Items Generator'));
