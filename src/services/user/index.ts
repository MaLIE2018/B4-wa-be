import express, { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import UserModel from './userSchema'

const UserRouter = express.Router()

UserRouter.post(
	"/register",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const request = await new UserModel(req.body).save();
			res.send(request._id);
		} catch (error: any) {
			if (error.errors) res.send(error.errors);
			else next(createError(400, "Bad Request!"));
		}
	}
);

UserRouter.get(
	"/login",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const request = await new UserModel(req.body).save();
			res.send(request._id);
		} catch (error: any) {
			if (error.errors) res.send(error.errors);
			else next(createError(400, "Bad Request!"));
		}
	}
);

export default UserRouter

// token with cookies not with body
//login basicAuth in auth/auth.ts