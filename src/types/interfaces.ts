import { NextFunction, Request, Response } from "express";

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export interface Profile {
  profile: {
    username?: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    googleId?: string;
    socketId?: string;
  };
  password?: string;
}

export interface User extends Profile {
  _id?: string;
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
    socketId?: string;
  };
  password?: string;
}

export interface Message {
  text: string;
  userId: string;
  type: string;
  hidden?: string[];
  content?: string[];
  position: Position;
  chatId: string;
}

enum Position {
  "left",
  "right",
}

export interface Chat {
  participants: string[];
  history: [];
  name: string;
  owner: string;
  _id?: string;
}

export interface ChatList {
  hidden: boolean;
  chat: string;
}
