"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const socket_1 = __importDefault(require("./socket"));
exports.PORT = process.env.PORT || 3001;
process.env.TS_NODE_DEV && require("dotenv").config();
<<<<<<< HEAD
// if (!process.env.MDB_URL)
//     throw new Error("MDB_URL not	set!");
=======
if (!process.env.MDB_URL)
    throw new Error("MDB_URL not	set!");
>>>>>>> developement
mongoose_1.default
    .connect(process.env.MDB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
<<<<<<< HEAD
    useFindAndModify: false,
})
    .then(function () {
    console.log("mongoose connected");
    socket_1.default.listen(exports.PORT, function () {
=======
    useCreateIndex: true,
})
    .then(() => {
    console.log("mongoose connected");
    socket_1.default.listen(exports.PORT, () => {
>>>>>>> developement
        console.table({ "Server running on port ": exports.PORT });
    });
});
