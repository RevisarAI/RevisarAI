import "dotenv/config";
import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";


const app = express();

const initApp = () => {
  app.use(cors());

  return new Promise<Express>((resolve, reject) => {
    mongoose
      .connect(process.env.DB_URL)
      .then(() => {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        resolve(app);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export = initApp;
