import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  console.log(token, "token");

  if (token) {
    try {
      const user = verifyToken(token);
      (req as any).user = user;
    } catch (error) {
      console.error("Token verification failed", error);
    }
  }
  next();
};
