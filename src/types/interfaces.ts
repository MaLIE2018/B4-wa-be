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
    socketId: string;
    online: boolean;
    lastSeen?: Date;
  };
  password?: string;
}

export interface User extends Profile {
  _id?: string;
  password?: string;
  friends?: User[];
  chats: Chat[];
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
    online: boolean;
    lastSeen?: Date;
  };
  password?: string;
}

export interface Message {
  text: string;
  userId: string;
  type: string;
  date: Date;
  status: string;
  image?: string;
  content?: string[];
}

export interface Chat {
  participants: string[];
  history: [];
  name: string;
  owner: string;
  _id?: string;
}

export interface plainChatList {
  hidden: boolean;
  chat: string;
}

export interface Participant {
  profile: {
    username?: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    googleId?: string;
    socketId: string;
    online: boolean;
    lastSeen?: Date;
  };
  _id: string;
}
