import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandlers from "./lib/errorhandler";
import { createServer } from "http";
import routes from "./services";
import passport from "passport";

const app = express();

const corsOptions = { origin: process.env.FE_URL, credentials: true };

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

const server = createServer(app);

app.use("/", routes);
app.use(errorHandlers);

export default server;
