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
    googleId?: string;
  };
  password?: string;
  status?: boolean;
  lastSeen?: string;
  friends?: User[];
  chats: { hidden: boolean; chatId: string }[];
  refreshToken?: string;
  save: Function;
}

export interface TestUser {
  profile: {
    username?: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  password?: string;
}

export interface Message {
  text: string;
  userId: string;
  hidden?: string[];
  content?: string[];
}
export interface extendedMessage extends Message {
  chatId: string;
}

export interface Chat {
  participants: string[];
  messages: Message[];
  name: string;
}

export interface ChatList {
  hidden: boolean;
  chatId: string;
}
