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
const chatSchema_1 = __importDefault(require("./services/chat/chatSchema"));
const io = new socket_io_1.Server(app_1.default);
io.on("connection", (socket) => {
    socket.on("connect", (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userSchema_1.default.findByIdAndUpdate(userId, {
                "profile.socketId": socket.id,
            });
        }
        catch (error) {
            console.log(error);
        }
    }));
    socket.on("give-me-my-socket-id", (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userSchema_1.default.findByIdAndUpdate(userId, {
                "profile.socketId": socket.id,
            });
        }
        catch (error) {
            console.log(error);
        }
    }));
    socket.on("connect-chats", (userId, chats) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userSchema_1.default.findByIdAndUpdate(userId, {
                "profile.socketId": socket.id,
            });
        }
        catch (error) {
            console.log(error);
        }
        if (chats.length > 0) {
            chats.forEach((chat) => {
                if (chat === null || chat === void 0 ? void 0 : chat._id) {
                    socket.join(chat._id);
                }
            });
            chats.forEach((chat) => {
                if (chat === null || chat === void 0 ? void 0 : chat._id) {
                    socket.to(chat._id).emit("logged-in", chat._id);
                }
            });
        }
    }));
    socket.on("participants-Join-room", (chatId, participants) => __awaiter(void 0, void 0, void 0, function* () {
        const socketList = yield io.sockets.allSockets();
        participants.map((participant) => {
            const socketId = participant.profile.socketId;
            if ([...socketList].includes(socketId)) {
                socket.to(socketId).emit("new-chat", chatId);
            }
        });
    }));
    socket.on("room-deleted", (chatId) => __awaiter(void 0, void 0, void 0, function* () {
        socket.to(chatId).emit("deleted-chat");
    }));
    socket.on("join-room", (chatId) => __awaiter(void 0, void 0, void 0, function* () {
        socket.join(chatId);
    }));
    socket.on("leave-room", (chatId) => __awaiter(void 0, void 0, void 0, function* () {
        socket.leave(chatId);
    }));
    socket.on("delete-message", (messageId, chatId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const message = yield chatSchema_1.default.findByIdAndUpdate(chatId, {
                $pull: { history: { _id: messageId } },
            }, { useFindAndModify: false });
            socket.to(chatId).emit("message-deleted", messageId, chatId);
            socket.emit("message-deleted", messageId, chatId);
        }
        catch (error) {
            console.log(error);
        }
    }));
    socket.on("send-message", (message, chatId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newMessage = yield chatSchema_1.default.findByIdAndUpdate(chatId, {
                latestMessage: Object.assign(Object.assign({}, message), { status: "received" }),
                $push: { history: Object.assign(Object.assign({}, message), { status: "received" }) },
            }, { new: true, useFindAndModify: false });
            socket
                .to(chatId)
                .emit("receive-message", newMessage.latestMessage, chatId);
            socket.emit("message-delivered", newMessage.latestMessage.date, chatId);
        }
        catch (error) {
            console.log(error);
        }
    }));
    socket.on("im-typing", (chatId) => {
        socket.to(chatId).emit("is-typing", chatId);
    });
    socket.on("i-stopped-typing", (chatId) => {
        socket.to(chatId).emit("stopped-typing", chatId);
    });
    socket.on("offline", (userId) => {
        [...socket.rooms].forEach((room) => {
            socket.to(room).emit("logged-out", room);
        });
    });
});
exports.default = app_1.default;
