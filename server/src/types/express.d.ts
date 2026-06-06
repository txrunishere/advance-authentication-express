import { User } from "../generated/prisma/client.js";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, "id" | "email" | "is_verified">;
      sessionId?: string;
    }
  }
}

export {};
