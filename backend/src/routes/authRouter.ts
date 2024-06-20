import { Router } from "express";
import authController from "../controllers/authController";
import registrationMiddleware from "../middlewares/registrationMiddleware";

const authRouter = Router();

authRouter.post("/register", registrationMiddleware, authController.register);

export default authRouter;
