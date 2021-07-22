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
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const oauth_1 = __importDefault(require("../../lib/auth/oauth"));
const userRouter = express_1.default.Router();
userRouter.get("/finduser/:query", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req.params.query:", req.params.query);
        const users = yield userSchema_1.default.find({
            "profile.email": { $regex: `${req.params.query}` },
        });
        if (users)
            res.status(200).send(users);
        else
            res.status(204).send(users);
    }
    catch (error) {
        next(error);
    }
}));
userRouter.get("/me", auth_1.JWTMiddleWare, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).send(req.user);
    }
    catch (error) {
        next(error);
    }
}));
userRouter.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield new userSchema_1.default(req.body).save();
        res.status(201).send(newUser);
    }
    catch (error) {
        if (error.name === "MongoError")
            res.send({
                error: error.keyValue,
                reason: "Duplicated key",
                advice: "Change the key value",
            });
        else if (error.name === "ValidationError")
            res.send(error.message);
        else
            next(http_errors_1.default(500, { message: error.message }));
    }
}));
userRouter.put("/update", auth_1.JWTMiddleWare, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateUser = yield userSchema_1.default.findByIdAndUpdate(req.user._id, Object.assign(Object.assign({}, req.body), { password: req.user.password }), { runValidators: true, new: true });
        res.status(201).send(updateUser);
    }
    catch (error) {
        if (error.name === "MongoError")
            res.send({
                error: error.keyValue,
                reason: "Duplicated key",
                advice: "Change the key value",
            });
        else if (error.name === "ValidationError")
            res.send(error.message);
        else
            next(http_errors_1.default(500, { message: error.message }));
    }
}));
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
userRouter.put("/profile", auth_1.JWTMiddleWare, upload, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.user.profile.avatar = req.file.path;
        yield req.user.save();
        res.status(200).send("operation is done successfully");
    }
    catch (error) {
        console.log(error);
        next(error);
        // next(createError(500, {message: error.message}));
    }
}));
userRouter.get("/all", auth_1.JWTMiddleWare, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userSchema_1.default.find();
        res.status(200).send(users);
    }
    catch (error) {
        next(http_errors_1.default(500, { message: error.message }));
    }
}));
userRouter.delete("/delete", auth_1.JWTMiddleWare, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteUser = yield userSchema_1.default.findByIdAndDelete(req.user._id);
        if (deleteUser)
            res.status(201).send("Profile deleted");
        else
            next(http_errors_1.default(400, "Bad Request"));
    }
    catch (error) {
        next(http_errors_1.default(500, { message: error.message }));
    }
}));
userRouter.get("/login", auth_1.basicAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            const { accessToken, refreshToken } = yield tools_1.JWTAuthenticate(req.user);
       res.cookie("access_token", accessToken, { httpOnly: true, sameSite: "none", secure:true, expire: 1800000 + Date.now() }); //sameSite: none, secure:true
res.cookie("refresh_token", refreshToken, { httpOnly: true, sameSite: "none", secure:true, expire: 604800000 + Date.now() });
            res.status(200).send(req.user);
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
// res.cookie("access_token", accessToken, { httpOnly: true, sameSite: "none", secure:true, expire: 1800000 + Date.now() }); //sameSite: none, secure:true
// res.cookie("refresh_token", refreshToken, { httpOnly: true, sameSite: "none", secure:true, expire: 604800000 + Date.now() });
userRouter.get("/logout", auth_1.JWTMiddleWare, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            req.user.profile.online = false;
            req.user.save();
res.clearCookie("access_token", { httpOnly: true, sameSite: "none", secure:true });
        res.clearCookie("refresh_token", { httpOnly: true, sameSite: "none", secure:true });
            res.status(200).send();
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
// res.clearCookie("access_token", { httpOnly: true, sameSite: "none", secure:true });
//         res.clearCookie("refresh_token", { httpOnly: true, sameSite: "none", secure:true });
userRouter.get("/me/friends", auth_1.JWTMiddleWare, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).send(req.user.friends);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
userRouter.post("/me/friends/:userId", auth_1.JWTMiddleWare, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const friend = yield userSchema_1.default.findById(req.params.userId);
        if (friend) {
            if (req.user.friends.indexOf(req.params.userId) === -1) {
                req.user.friends.push(req.params.userId);
                yield req.user.save();
            }
            res.status(200).send();
        }
        else {
            next(http_errors_1.default(404, { message: "User not found." }));
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
userRouter.get("/googlelogin", oauth_1.default.authenticate("google", { scope: ["profile", "email"] }));
userRouter.get("/googleRedirect", oauth_1.default.authenticate("google"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("accessToken", req.user.tokens.accessToken, {
            httpOnly: true,
        });
        res.cookie("refreshToken", req.user.tokens.refreshToken, {
            httpOnly: true,
        });
        res.send("OK");
        //   if (process.env.FE_URL !== undefined)
        //     res.status(200).redirect(process.env.FE_URL);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = userRouter;
