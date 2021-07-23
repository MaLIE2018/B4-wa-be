import express, { NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandlers from "./lib/errorhandler";
import { createServer } from "http";
import routes from "./services";
import passport from "passport";
import createError from "http-errors";

const app = express();

const originsURLS = [process.env.FE_URL, process.env.FE_DEV_URL];

const corsOptions = {
  origin: function (origin: any, next: any) {
    if (originsURLS.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(createError(403, { message: "Check your cors settings!" }));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

const server = createServer(app);

app.use("/", routes);
app.use(errorHandlers);

export default server;
