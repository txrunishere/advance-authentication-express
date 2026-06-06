import { User } from "../../generated/prisma/client.js";

export const safeUser = (user: User) => {
  return {
    id: user.id,
    email: user.email,
    is_verified: user.is_verified,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};
