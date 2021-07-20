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
exports.verifyAccessToken = exports.verifyRefreshToken = exports.JWTAuthenticate = void 0;
<<<<<<< HEAD
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
var JWTAuthenticate = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, refreshToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, generateAccessToken({ _id: user._id })];
            case 1:
                accessToken = _a.sent();
                return [4 /*yield*/, generateRefreshToken({ _id: user._id })];
            case 2:
                refreshToken = _a.sent();
                user.refreshToken = refreshToken;
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                return [2 /*return*/, { accessToken: accessToken, refreshToken: refreshToken }];
        }
    });
}); };
exports.JWTAuthenticate = JWTAuthenticate;
var verifyRefreshToken = function (refreshToken) {
    return new Promise(function (resolve, reject) {
        return jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET, function (err, decodedToken) {
            if (err)
                reject(err);
            resolve(decodedToken);
        });
    });
};
=======
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
>>>>>>> developement
exports.verifyRefreshToken = verifyRefreshToken;
const verifyAccessToken = (accessToken) => new Promise((resolve, reject) => jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err)
        reject(err);
    resolve(decodedToken);
}));
exports.verifyAccessToken = verifyAccessToken;
