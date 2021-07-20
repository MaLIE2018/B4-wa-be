"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var index_1 = __importDefault(require("./chat/index"));
var auth_1 = require("./../lib/auth/auth");
var index_2 = __importDefault(require("./user/index"));
var route = express_1.default.Router();
route.use("/chat", auth_1.JWTMiddleWare, index_1.default);
route.use("/users", index_2.default);
exports.default = route;
