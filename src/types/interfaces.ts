import { NextFunction, Request, Response } from "express";

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export interface User {
  profile: {
    username?: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  password?: string;
  status?: string;
  lastSeen?: string;
  friends?: User[];
  refreshToken?: string;
}
