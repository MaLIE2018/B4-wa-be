import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandlers from "./lib/errorhandler";
import { createServer } from "http";

const app = express();

const corsOptions = { origin: "http://localhost:3000", credentials: true };

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const server = createServer(app);

// app.use("/accommodation", destinationRouter, accommodationRouter);
// app.use("/users", userRouter);
app.use(errorHandlers);

export default server;
