"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = exports.verifyRefreshToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var generateAccessToken = function (payload) {
    return new Promise(function (resolve, reject) {
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "10 min" }, function (err, token) {
            if (err)
                reject(err);
            resolve(token);
        });
    });
};
var generateRefreshToken = function (payload) {
    return new Promise(function (resolve, reject) {
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "15 days" }, function (err, token) {
            if (err)
                reject(err);
            resolve(token);
        });
    });
};
// export const JWTAuthenticate = async (user: User) => {
//   const accessToken = await generateAccessToken({ _id: user._id });
//   const refreshToken = await generateRefreshToken({ _id: user._id });
//   user.refreshToken = refreshToken;
//   await user.save();
//   return { accessToken, refreshToken };
// };
var verifyRefreshToken = function (refreshToken) {
    return new Promise(function (resolve, reject) {
        return jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET, function (err, decodedToken) {
            if (err)
                reject(err);
            resolve(decodedToken);
        });
    });
};
exports.verifyRefreshToken = verifyRefreshToken;
var verifyAccessToken = function (accessToken) {
    return new Promise(function (resolve, reject) {
        return jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET, function (err, decodedToken) {
            if (err)
                reject(err);
            resolve(decodedToken);
        });
    });
};
exports.verifyAccessToken = verifyAccessToken;
