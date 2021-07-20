"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
<<<<<<< HEAD
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var errorhandler_1 = __importDefault(require("./lib/errorhandler"));
var http_1 = require("http");
var services_1 = __importDefault(require("./services"));
var app = express_1.default();
var corsOptions = { origin: ["http://localhost:3000"], credentials: true };
app.use(cors_1.default(corsOptions));
app.use(express_1.default.json());
app.use(cookie_parser_1.default());
var server = http_1.createServer(app);
=======
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorhandler_1 = __importDefault(require("./lib/errorhandler"));
const http_1 = require("http");
const services_1 = __importDefault(require("./services"));
const app = express_1.default();
const corsOptions = { origin: process.env.FE_URL, credentials: true };
app.use(cors_1.default(corsOptions));
app.use(express_1.default.json());
app.use(cookie_parser_1.default());
const server = http_1.createServer(app);
>>>>>>> developement
app.use("/", services_1.default);
app.use(errorhandler_1.default);
exports.default = server;
