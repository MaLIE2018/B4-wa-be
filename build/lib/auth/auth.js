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
exports.basicAuthMiddleware = exports.JWTMiddleWare = void 0;
const userSchema_1 = __importDefault(require("../../services/user/userSchema"));
const http_errors_1 = __importDefault(require("http-errors"));
const tools_1 = require("./tools");
const atob_1 = __importDefault(require("atob"));
const JWTMiddleWare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.cookies.access_token) {
        next(http_errors_1.default(401, { message: "Provide Access Token" }));
    }
    else {
        try {
            const content = yield tools_1.verifyAccessToken(req.cookies.access_token);
            const user = yield userSchema_1.default.findById(content._id)
                .populate("friends", {
                profile: 1,
            })
                .populate({
                path: "chats",
                select: { participants: 1, latestMessage: 1 },
                populate: {
                    path: "participants",
                    select: "profile",
                },
            });
            if (user) {
                req.user = user;
                next();
            }
            else {
                next(http_errors_1.default(404, { message: "User not found" }));
            }
        }
        catch (error) {
            next(http_errors_1.default(401, { message: "AccessToken not valid" }));
        }
    }
});
exports.JWTMiddleWare = JWTMiddleWare;
const basicAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        next(http_errors_1.default(401, { message: "Authorization required" }));
    }
    else {
        const decoded = atob_1.default(req.headers.authorization.split(" ")[1]);
        const [email, password] = decoded.split(":");
        const user = yield userSchema_1.default.checkCredentials(email, password);
        if (user) {
            req.user = user;
            next();
        }
        else {
            next(http_errors_1.default(401, { message: "Credentials wrong" }));
        }
    }
});
exports.basicAuthMiddleware = basicAuthMiddleware;
