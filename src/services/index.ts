import express from "express";
import chatRouter from "./chat/index";
import { JWTMiddleWare } from "./../lib/auth/auth";
import userRouter from "./user/index";
import messageRouter from "./message";

const route = express.Router();

route.use("/chat", JWTMiddleWare, chatRouter);
route.use("/users", userRouter);
route.use("/message", JWTMiddleWare, messageRouter);

export default route;
