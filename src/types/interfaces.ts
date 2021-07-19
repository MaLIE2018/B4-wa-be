import { NextFunction, Request, Response } from "express";

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;


export interface User {
	firstName: string;
	lastName: string;
	email: string;
	password?: string;
	avatar?: string;
	username?: string;
	status?: string;
	lastSeen?: string;
	friends?: User[]
  refreshToken?: string;
  socketId?:string
}