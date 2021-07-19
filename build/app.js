"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var errorhandler_1 = __importDefault(require("./lib/errorhandler"));
var http_1 = require("http");
var app = express_1.default();
var corsOptions = { origin: "http://localhost:3000", credentials: true };
app.use(cors_1.default(corsOptions));
app.use(express_1.default.json());
app.use(cookie_parser_1.default());
var server = http_1.createServer(app);
// app.use("/accommodation", destinationRouter, accommodationRouter);
// app.use("/users", userRouter);
app.use(errorhandler_1.default);
// service/route files ==> index == export route into this file
exports.default = server;
