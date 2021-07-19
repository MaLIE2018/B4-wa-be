"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var socket_io_1 = require("socket.io");
var io = new socket_io_1.Server(app_1.default, { allowEIO3: true });
io.on("connect", function (socket) {
    console.log(socket.id);
});
exports.default = app_1.default;
