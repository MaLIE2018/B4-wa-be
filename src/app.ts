import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandlers from "./lib/errorhandler";
import { createServer } from "http";
import routes from "./services";

const app = express();

const corsOptions = { origin: process.env.FE_URL, credentials: true };

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const server = createServer(app);

app.use("/", routes);
app.use(errorHandlers);

export default server;
