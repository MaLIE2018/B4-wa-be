"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var socket_1 = __importDefault(require("./socket"));
exports.PORT = process.env.PORT || 3001;
process.env.TS_NODE_DEV && require("dotenv").config();
if (!process.env.MDB_URL)
    throw new Error("MDB_URL not	set!");
mongoose_1.default.connect(process.env.MDB_URL, { useNewUrlParser: true }).then(function () {
    socket_1.default.listen(exports.PORT, function () {
        console.log("Server running on port " + exports.PORT);
    });
});
