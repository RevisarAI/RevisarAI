import { Express } from 'express';
import initApp from './app';
import { createServer } from 'revisar-server-utils/server';

const { PORT } = process.env as Record<string, string>;

initApp().then((app: Express) => createServer(app, PORT, 'Reviews Loader'));
