import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../types/auth";

export const verifyToken = (token: string): CustomJwtPayload => {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET!
  ) as CustomJwtPayload;
};