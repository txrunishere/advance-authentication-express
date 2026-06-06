import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env.config.js";
import { JWTPayload } from "../../types/index.js";

const signAccessToken = (payload: JWTPayload) => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

const signRefreshToken = (payload: JWTPayload) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

const verifyAccessToken = (accessToken: string) => {
  return jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET) as JWTPayload;
};

const verifyRefreshToken = (refreshToken: string) => {
  return jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET) as JWTPayload;
};

export {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
