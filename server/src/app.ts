import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env.config.js";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health-check", (_: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    timestamp: Date.now(),
    message: "Health is fine",
  });
});

import authRouter from "./routes/auth.routes.js";

app.use("/api/v1/auth", authRouter);

app.use(globalErrorHandler);

export default app;
