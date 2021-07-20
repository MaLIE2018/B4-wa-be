"use strict";
<<<<<<< HEAD
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
=======
>>>>>>> developement
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
<<<<<<< HEAD
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
=======
>>>>>>> developement
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
<<<<<<< HEAD
var express_1 = __importDefault(require("express"));
var http_errors_1 = __importDefault(require("http-errors"));
var auth_1 = require("../../lib/auth/auth");
var userSchema_1 = __importDefault(require("./userSchema"));
var tools_1 = require("../../lib/auth/tools");
var cloudinary = require("cloudinary").v2;
var CloudinaryStorage = require("multer-storage-cloudinary").CloudinaryStorage;
var multer = require("multer");
var userRouter = express_1.default.Router();
userRouter.post("/register", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var newUser, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, new userSchema_1.default(req.body).save()];
            case 1:
                newUser = _a.sent();
                res.status(201).send(newUser);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                if (error_1.name === "MongoError")
                    res.send({
                        error: error_1.keyValue,
                        reason: "Duplicated key",
                        advice: "Change the key value",
                    });
                else if (error_1.name === "ValidationError")
                    res.send(error_1.message);
                else
                    next(http_errors_1.default(500, { message: error_1.message }));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
userRouter.put("/update", auth_1.JWTMiddleWare, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var updateUser, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userSchema_1.default.findByIdAndUpdate(req.user._id, __assign(__assign({}, req.body), { password: req.user.password }), { runValidators: true, new: true })];
            case 1:
                updateUser = _a.sent();
                res.status(201).send(updateUser);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                if (error_2.name === "MongoError")
                    res.send({
                        error: error_2.keyValue,
                        reason: "Duplicated key",
                        advice: "Change the key value",
                    });
                else if (error_2.name === "ValidationError")
                    res.send(error_2.message);
                else
                    next(http_errors_1.default(500, { message: error_2.message }));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
var storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "test",
    },
});
var upload = multer({ storage: storage }).single("img");
userRouter.put("/profile", auth_1.JWTMiddleWare, upload, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                req.user.profile.avatar = req.file.path;
                return [4 /*yield*/, req.user.save()];
            case 1:
                _a.sent();
                res.status(200).send("operation is done successfully");
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.log(error_3);
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
userRouter.get("/all", auth_1.basicAuthMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var users, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userSchema_1.default.find()];
            case 1:
                users = _a.sent();
                res.status(200).send(users);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                next(http_errors_1.default(500, { message: error_4.message }));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
userRouter.delete("/delete", auth_1.basicAuthMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var deleteUser, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userSchema_1.default.findByIdAndDelete(req.user._id)];
            case 1:
                deleteUser = _a.sent();
                if (deleteUser)
                    res.status(201).send("Profile deleted");
                else
                    next(http_errors_1.default(400, "Bad Request"));
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                next(http_errors_1.default(500, { message: error_5.message }));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
userRouter.get("/login", auth_1.basicAuthMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, accessToken, refreshToken, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                if (!req.user) return [3 /*break*/, 2];
                return [4 /*yield*/, tools_1.JWTAuthenticate(req.user)];
            case 1:
                _a = _b.sent(), accessToken = _a.accessToken, refreshToken = _a.refreshToken;
                res.cookie("access_token", accessToken, { httpOnly: true }); //sameSite: none, secure:true
                res.cookie("refresh_token", refreshToken, { httpOnly: true });
                res.status(200).send("Welcome");
                _b.label = 2;
            case 2: return [3 /*break*/, 4];
            case 3:
                error_6 = _b.sent();
                console.log(error_6);
                next(error_6);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
userRouter.get("/logout", auth_1.JWTMiddleWare, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
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
        return [2 /*return*/];
    });
}); });
=======
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
>>>>>>> developement
exports.default = userRouter;
// every route with Authentication
//logout
//add friend to friendList //delete friends
//get all my friends.profiles
//put profile
