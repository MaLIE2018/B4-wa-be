import express from "express";
import createError from "http-errors";
import { basicAuthMiddleware } from "../../lib/auth/auth";
import UserModel from "./userSchema";
import { JWTAuthenticate } from "../../lib/auth/tools";

const userRouter = express.Router();

userRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    next(createError(500, { message: error.message }));
  }
});

userRouter.get("/login", basicAuthMiddleware, async (req: any, res, next) => {
  try {
    if (req.user) {
      const { accessToken, refreshToken } = await JWTAuthenticate(req.user);
      res.cookie("access_token", accessToken, { httpOnly: true }); //sameSite: none, secure:true
      res.cookie("refresh_token", refreshToken, { httpOnly: true });
      res.status(200).send();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.get(
  "/logout",
  JWTMiddleWare,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        res.status(200).send();
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default userRouter;

// every route with Authentication
//logout

//add friend to friendList //delete friends
//get all my friends.profiles

//put profile
