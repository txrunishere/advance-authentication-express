import bcrypt from "bcrypt";
import { env } from "../../config/env.config.js";

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(env.SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export { hashPassword, comparePassword };
