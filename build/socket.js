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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const socket_io_1 = require("socket.io");
const userSchema_1 = __importDefault(require("./services/user/userSchema"));
const messageSchema_1 = __importDefault(require("./services/message/messageSchema"));
const chatSchema_1 = __importDefault(require("./services/chat/chatSchema"));
const io = new socket_io_1.Server(app_1.default, {
    cors: {
        origin: process.env.FE_URL,
        methods: ["GET", "POST", "DELETE", "PUT"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
    allowEIO3: true,
});
<<<<<<< HEAD
io.on("connect", (socket) => {
    socket.on("connect", (userId, chats) => __awaiter(void 0, void 0, void 0, function* () {
        yield userSchema_1.default.findByIdAndUpdate(userId, { online: true }, { useFindAndModify: false });
        chats.forEach((chat) => {
            if (!chat.hidden)
                socket.join(chat.chatId);
        });
        socket.emit("loggedIn");
=======
io.on("connection", (socket) => {
    socket.on("connect", (userId, chats) => __awaiter(void 0, void 0, void 0, function* () {
        yield userSchema_1.default.findByIdAndUpdate(userId, { online: true }, { useFindAndModify: false });
        chats.forEach((chat) => {
            socket.join(chat.chat);
        });
        socket.emit("loggedIn");
    }));
    socket.on("joinRoom", (chatId) => __awaiter(void 0, void 0, void 0, function* () {
        socket.join(chatId);
        console.log("Rooms", socket.rooms);
>>>>>>> developement
    }));
    socket.on("leaveRoom", (chatId) => __awaiter(void 0, void 0, void 0, function* () {
        socket.leave(chatId);
        console.log("newChat", socket.rooms);
    }));
    socket.on("sendMessage", (message) => __awaiter(void 0, void 0, void 0, function* () {
        const nm = new messageSchema_1.default(message);
        yield nm.save();
        yield chatSchema_1.default.findByIdAndUpdate(message.chatId, {
            latestMessage: nm,
        });
        socket.to(message.chatId).emit("message", "test");
        socket.emit("message", message.text);
    }));
    socket.on("leaveChat", (chatId) => __awaiter(void 0, void 0, void 0, function* () {
        socket.leave(chatId);
    }));
    socket.on("disconnect", (userId) => __awaiter(void 0, void 0, void 0, function* () {
        yield userSchema_1.default.findOneAndUpdate({ _id: userId }, { online: false });
    }));
});
exports.default = app_1.default;
