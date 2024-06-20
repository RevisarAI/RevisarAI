import { Router } from "express";
import authController from "../controllers/authController";
import validateClientMiddleware from "../middlewares/validateClientMiddleware";

const authRouter = Router();

authRouter.post("/register", validateClientMiddleware, authController.register);

export default authRouter;
