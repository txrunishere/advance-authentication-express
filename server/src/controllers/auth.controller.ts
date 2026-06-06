import type { Response, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { AppResponse } from "../utils/AppResponse.js";
import { prisma } from "../lib/prisma.js";
import { comparePassword, hashPassword } from "../utils/auth/password.js";
import { signAccessToken, signRefreshToken } from "../utils/auth/jwt.js";
import {
  clearCookies,
  generateSessionId,
  hashRefreshToken,
  setCookies,
} from "../utils/auth/auth.helper.js";
import { safeUser } from "../utils/common/safeUser.js";
import { Prisma } from "../generated/prisma/client.js";

const handleRegisterUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const passwordHash = await hashPassword(password);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password_hash: passwordHash,
        },
      });

      const sessionId = generateSessionId();

      const tokenPayload = {
        sub: user.id,
        sessionId,
      };

      const accessToken = signAccessToken(tokenPayload);
      const refreshToken = signRefreshToken(tokenPayload);

      const hashedRefreshToken = hashRefreshToken(refreshToken);

      await tx.session.create({
        data: {
          id: sessionId,
          userId: user.id,
          refresh_token_hash: hashedRefreshToken,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        user,
        accessToken,
        refreshToken,
      };
    });

    setCookies(res, result.refreshToken);

    return AppResponse(res, 201, {
      success: true,
      message: "User registered successfully",
      data: {
        user: safeUser(result.user),
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError("User already exists", 409);
    }

    throw error;
  }
});

const handleLoginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError("User not found", 401);
  }

  const isPasswordValid = await comparePassword(password, user.password_hash);

  if (!isPasswordValid) {
    throw new AppError("Invalid password", 401);
  }

  const sessionId = generateSessionId();

  const tokenPayload = {
    sub: user.id,
    sessionId,
  };

  const accessToken = signAccessToken(tokenPayload);

  const refreshToken = signRefreshToken(tokenPayload);

  const hashedRefreshToken = hashRefreshToken(refreshToken);

  await prisma.session.create({
    data: {
      id: sessionId,
      userId: user.id,
      refresh_token_hash: hashedRefreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  setCookies(res, refreshToken);

  return AppResponse(res, 200, {
    success: true,
    message: "Login successful",
    data: {
      user: safeUser(user),
      accessToken,
    },
  });
});

const handleLogoutUser = asyncHandler(async (req: Request, res: Response) => {
  if (req.sessionId) {
    await prisma.session.deleteMany({
      where: {
        id: req.sessionId,
      },
    });
  }

  clearCookies(res);

  return AppResponse(res, 200, {
    success: true,
    message: "Logged out successfully",
  });
});

export { handleRegisterUser, handleLoginUser, handleLogoutUser };
