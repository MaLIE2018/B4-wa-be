import { NextFunction, Request, Response } from "express";

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export interface User {
  _id?: string;
  profile: {
    username?: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  password?: string;
  status?: boolean;
  lastSeen?: string;
  friends?: User[];
  refreshToken?: string;
  save: Function;
}

export interface Message {
  text: string;
  userId: string;
  hidden: string[];
  content?: string[];
}

export interface Chat {
  ownerId: string;
  participants: string[];
  messages: Message[];
}
