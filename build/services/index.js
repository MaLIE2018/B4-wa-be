"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./chat/index"));
const auth_1 = require("./../lib/auth/auth");
const index_2 = __importDefault(require("./user/index"));
const message_1 = __importDefault(require("./message"));
const route = express_1.default.Router();
route.use("/chat", auth_1.JWTMiddleWare, index_1.default);
route.use("/users", index_2.default);
route.use("/message", auth_1.JWTMiddleWare, message_1.default);
exports.default = route;
