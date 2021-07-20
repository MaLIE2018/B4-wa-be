"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
<<<<<<< HEAD
var express_1 = __importDefault(require("express"));
var index_1 = __importDefault(require("./chat/index"));
var auth_1 = require("./../lib/auth/auth");
var index_2 = __importDefault(require("./user/index"));
var route = express_1.default.Router();
=======
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./chat/index"));
const auth_1 = require("./../lib/auth/auth");
const index_2 = __importDefault(require("./user/index"));
const route = express_1.default.Router();
>>>>>>> developement
route.use("/chat", auth_1.JWTMiddleWare, index_1.default);
route.use("/users", index_2.default);
exports.default = route;
