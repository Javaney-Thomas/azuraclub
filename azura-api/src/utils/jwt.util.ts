import jwt from "jsonwebtoken";
import env from "../config/env";
import { IUser } from "../models/user.model";

export const generateToken = (user: IUser): string => {
  // Include only necessary user info in the token payload.
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: "1d" }
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, env.jwtSecret);
};
