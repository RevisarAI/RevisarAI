import "dotenv/config";
import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import reviewsRouter from "./routes/reviewsRoutes";
import apiKeyRouter from "./routes/apiKeyRoutes";


const app = express();

const initApp = () => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/reviews", reviewsRouter);
  app.use("/keys", apiKeyRouter)

  return new Promise<Express>((resolve, reject) => {
    mongoose
      .connect(process.env.DB_URL)
      .then(() => {
       
        resolve(app);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export = initApp;
