import { Router } from "express";
import authController from "../controllers/authController";
import registrationMiddleware from "../middlewares/registrationMiddleware";
import loginMiddleware from "../middlewares/loginMiddleware";

const authRouter = Router();

authRouter.post("/register", registrationMiddleware, authController.register);
authRouter.post("/login", loginMiddleware, authController.login);

export default authRouter;
