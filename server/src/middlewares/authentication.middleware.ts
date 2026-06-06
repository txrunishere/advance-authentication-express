import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { JWTPayload } from "../types/index.js";
import { env } from "../config/env.config.js";

export const protect = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Authentication required", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    let payload: JWTPayload;

    try {
      payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JWTPayload;
    } catch {
      throw new AppError("Invalid or expired access token", 401);
    }

    if (!payload.sub || !payload.sessionId) {
      throw new AppError("Invalid token payload", 401);
    }

    const session = await prisma.session.findUnique({
      where: {
        id: payload.sessionId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            is_verified: true,
          },
        },
      },
    });

    if (!session) {
      throw new AppError("Session not found", 401);
    }

    if (session.userId !== payload.sub) {
      throw new AppError("Invalid session", 401);
    }

    if (session.expires_at < new Date()) {
      throw new AppError("Session expired", 401);
    }

    req.user = session.user;
    req.sessionId = session.id;

    next();
  },
);
