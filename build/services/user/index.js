"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const auth_1 = require("../../lib/auth/auth");
const userSchema_1 = __importDefault(require("./userSchema"));
const tools_1 = require("../../lib/auth/tools");
const userRouter = express_1.default.Router();
userRouter.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new userSchema_1.default(req.body);
        yield newUser.save();
        res.status(201).send(newUser);
    }
    catch (error) {
        next(http_errors_1.default(500, { message: error.message }));
    }
}));
userRouter.get("/login", auth_1.basicAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            const { accessToken, refreshToken } = yield tools_1.JWTAuthenticate(req.user);
            res.cookie("access_token", accessToken, { httpOnly: true }); //sameSite: none, secure:true
            res.cookie("refresh_token", refreshToken, { httpOnly: true });
            res.status(200).send(req.user);
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
userRouter.get("/logout", auth_1.JWTMiddleWare, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");
            res.status(200).send();
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
exports.default = userRouter;
// every route with Authentication
//logout
//add friend to friendList //delete friends
//get all my friends.profiles
//put profile
