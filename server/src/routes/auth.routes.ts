import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import {
  handleLoginUser,
  handleLogoutUser,
  handleRegisterUser,
} from "../controllers/auth.controller.js";
import { signInSchema, signUpSchema } from "../schema/auth.schema.js";

const authRouter = Router();

authRouter.post("/register", validate(signUpSchema), handleRegisterUser);
authRouter.post("/login", validate(signInSchema), handleLoginUser);
authRouter.post("/logout", handleLogoutUser);

export default authRouter;
