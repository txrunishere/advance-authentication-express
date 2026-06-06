import crypto from "crypto";
import { Response } from "express";
import ms from "ms";
import { env } from "../../config/env.config.js";

const generateSessionId = () => {
  return crypto.randomUUID();
};

const hashRefreshToken = (refreshToken: string) => {
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
};

const setCookies = (res: Response, refreshToken: string) => {
  const refreshTokenMaxAge = ms(env.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue);

  if (typeof refreshTokenMaxAge !== "number") {
    throw new Error("Invalid refresh token expiry configuration");
  }

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: refreshTokenMaxAge,
  });
};

const clearCookies = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

export { generateSessionId, clearCookies, setCookies, hashRefreshToken };
