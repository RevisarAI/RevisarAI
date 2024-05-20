import "dotenv/config";
import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import reviewsRouter from "./routes/reviewsRoutes";


const app = express();

const initApp = () => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/reviews", reviewsRouter);

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
