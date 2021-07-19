import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandlers from "./lib/errorhandler";
import { createServer } from "http";
import route from "./services";

const app = express();

const corsOptions = { origin: "http://localhost:3000", credentials: true };

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const server = createServer(app);

app.use("/", route);
app.use(errorHandlers);

export default server;
