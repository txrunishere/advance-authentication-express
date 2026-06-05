import type { Response, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { AppResponse } from "../utils/AppResponse.js";

const handleRegisterUser = asyncHandler(
  async (req: Request, res: Response) => {},
);

const handleLoginUser = asyncHandler(async (req: Request, res: Response) => {});

const handleLogoutUser = asyncHandler(
  async (req: Request, res: Response) => {},
);

export { handleRegisterUser, handleLoginUser, handleLogoutUser };
