import { JwtPayload } from "jsonwebtoken";

export type ResponsePayload<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export type JWTPayload = JwtPayload & {
  sessionId: string;
};
