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
exports.verifyAccessToken = exports.verifyRefreshToken = exports.JWTAuthenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (payload) => new Promise((resolve, reject) => jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "10 min" }, (err, token) => {
    if (err)
        reject(err);
    resolve(token);
}));
const generateRefreshToken = (payload) => new Promise((resolve, reject) => jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "15 days" }, (err, token) => {
    if (err)
        reject(err);
    resolve(token);
}));
const JWTAuthenticate = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield generateAccessToken({ _id: user._id });
    const refreshToken = yield generateRefreshToken({ _id: user._id });
    user.refreshToken = refreshToken;
    yield user.save();
    return { accessToken, refreshToken };
});
exports.JWTAuthenticate = JWTAuthenticate;
const verifyRefreshToken = (refreshToken) => new Promise((resolve, reject) => jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err)
        reject(err);
    resolve(decodedToken);
}));
exports.verifyRefreshToken = verifyRefreshToken;
const verifyAccessToken = (accessToken) => new Promise((resolve, reject) => jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err)
        reject(err);
    resolve(decodedToken);
}));
exports.verifyAccessToken = verifyAccessToken;
