import env from 'dotenv';
import { Mongoose } from 'mongoose';
import initDB from 'revisar-server-utils/db';

env.config();

const { DB_URL, DB_NAME } = process.env as Record<string, string>;

export const db = new Mongoose();

export const connectDB = async () => initDB(DB_URL, DB_NAME, db);
