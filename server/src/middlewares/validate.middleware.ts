import z from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export const validate = (schema: z.ZodType<any>) => {
  return (req: Request, _: Response, next: NextFunction) => {
    const parsedData = schema.safeParse(req.body);

    if (!parsedData.success) {
      const errors = parsedData.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      throw new AppError(
        errors.map((error) => `${error.field}: ${error.message}`).join(", "),
        400,
      );
    }

    req.body = parsedData.data;
    next();
  };
};
