import express from "express";
import chatRouter from "./chat/index";
import { JWTMiddleWare } from "./../lib/auth/auth";
import userRouter from "./user/index";

const route = express.Router();

route.use("/chat", JWTMiddleWare, chatRouter);
route.use("/users", userRouter);

export default route;
