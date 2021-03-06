import express, {
  Request,
  Response,
  NextFunction,
  request,
  CookieOptions,
} from "express";
import createError from "http-errors";
import { basicAuthMiddleware, JWTMiddleWare } from "../../lib/auth/auth";
import UserModel from "./userSchema";
import { JWTAuthenticate } from "../../lib/auth/tools";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import passport from "../../lib/auth/oauth";
import { User } from "../../types/interfaces";

const userRouter = express.Router();

userRouter.get("/finduser/:query", async (req, res, next) => {
  try {
    console.log("req.params.query:", req.params.query);
    const users = await UserModel.find({
      "profile.firstName": { $regex: `${req.params.query}`, $options: "i" },
    });
    if (users) res.status(200).send(users);
    else res.status(204).send(users);
  } catch (error) {
    next(error);
  }
});

userRouter.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = new UserModel({
        ...req.body,
        profile: {
          ...req.body.profile,
          email: req.body.profile.email.toLowerCase(),
        },
      });
      await newUser.save();
      res.status(201).send(newUser);
    } catch (error: any) {
      if (error.name === "MongoError")
        next(
          createError(400, {
            message: {
              error: error.keyValue,
              reason: "Duplicated key",
              advice: "Change the key value",
            },
          })
        );
      else if (error.name === "ValidationError")
        next(createError(400, { message: "ValidationError" }));
      else next(createError(500, { message: error.message }));
    }
  }
);

userRouter.put(
  "/update",
  JWTMiddleWare,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateUser = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
          ...req.body,
          password: req.user.password,
        },
        { runValidators: true, new: true }
      );
      res.status(201).send(updateUser);
    } catch (error: any) {
      if (error.name === "MongoError")
        res.send({
          error: error.keyValue,
          reason: "Duplicated key",
          advice: "Change the key value",
        });
      else if (error.name === "ValidationError") res.send(error.message);
      else next(createError(500, { message: error.message }));
    }
  }
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECTRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "test",
  },
});

const upload = multer({ storage: storage }).single("img");

userRouter.put(
  "/profile",
  JWTMiddleWare,
  upload,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      req.user.profile.avatar = req.file.path;
      await req.user.save();
      res.status(200).send("operation is done successfully");
    } catch (error: any) {
      console.log(error);
      next(error);
      // next(createError(500, {message: error.message}));
    }
  }
);

userRouter.get(
  "/all",
  JWTMiddleWare,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserModel.find();
      res.status(200).send(users);
    } catch (error: any) {
      next(createError(500, { message: error.message }));
    }
  }
);

userRouter.delete(
  "/delete",
  JWTMiddleWare,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleteUser = await UserModel.findByIdAndDelete(req.user._id);
      if (deleteUser) res.status(201).send("Profile deleted");
      else next(createError(400, "Bad Request"));
    } catch (error: any) {
      next(createError(500, { message: error.message }));
    }
  }
);

const cookieOptions: CookieOptions =
  process.env.NODE_ENV === "development"
    ? { httpOnly: true }
    : {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        expires: new Date(Date.now() + 900000),
      };

userRouter.get(
  "/login",
  basicAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        const { accessToken, refreshToken } = await JWTAuthenticate(req.user);
        res.cookie("access_token", accessToken, cookieOptions); //sameSite: none, secure:true
        res.cookie("refresh_token", refreshToken, cookieOptions);
        res.status(200).send(req.user);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

userRouter.get(
  "/logout",
  JWTMiddleWare,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        req.user.profile.online = false;
        req.user.profile.lastSeen = new Date();
        req.user.save();
        res.clearCookie("access_token", cookieOptions);
        res.clearCookie("refresh_token", cookieOptions);
        res.status(200).send();
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
// res.clearCookie("access_token", { httpOnly: true, sameSite: "none", secure:true });
//         res.clearCookie("refresh_token", { httpOnly: true, sameSite: "none", secure:true });

userRouter.get("/me", JWTMiddleWare, async (req: any, res, next) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    next(error);
  }
});

userRouter.get(
  "/me/friends",
  JWTMiddleWare,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).send(req.user.friends);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

userRouter.get(
  "/me/friends/:query",
  JWTMiddleWare,
  async (req: any, res, next) => {
    try {
      const user = await UserModel.findById(req.user._id).populate("friends");
      const friend = user?.friends?.filter((user) =>
        user.profile.firstName.includes(req.params.query)
      );
      res.status(200).send(friend);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.post(
  "/me/friends/:userId",
  JWTMiddleWare,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const friend = await UserModel.findById(req.params.userId);
      if (friend) {
        if (req.user.friends.indexOf(req.params.userId) === -1) {
          req.user.friends.push(req.params.userId);
          await req.user.save();
        }
        res.status(200).send();
      } else {
        next(createError(404, { message: "User not found." }));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

userRouter.get(
  "/googlelogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRouter.get(
  "/googleRedirect",
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
      res.cookie("access_token", req.user.tokens.accessToken, cookieOptions);
      res.cookie("refresh_token", req.user.tokens.refreshToken, cookieOptions);
      res.status(200).redirect("https://whatsappclone-mu.vercel.app/home");
    } catch (error) {
      next(error);
    }
  }
);

export default userRouter;
