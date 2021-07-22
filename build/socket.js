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
const { instrument } = require("@socket.io/admin-ui");
const io = new socket_io_1.Server(app_1.default, {
    cors: {
        origin: [process.env.FE_URL, "https://admin.socket.io/"],
        methods: ["GET", "POST", "DELETE", "PUT"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
    allowEIO3: true,
});
io.on("connection", (socket) => {
    socket.on("connect-chats", (userId, chats) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield userSchema_1.default.findByIdAndUpdate(userId, { "profile.online": true, "profile.socketId": socket.id }, { useFindAndModify: false });
        }
        catch (error) {
            console.log(error);
        }
        chats.forEach((chat) => {
            socket.join(chat.chat._id);
        });
        socket.emit("loggedIn", "connected");
        console.log(socket.id, socket.rooms);
    }));
    socket.on("participantsJoinRoom", (chatId, participants) => __awaiter(void 0, void 0, void 0, function* () {
        participants.map((participant) => {
            const socketId = participant.profile.socketId;
            io.of("/").adapter.on("join-room", (chatId, socketId) => {
                console.log(`socket ${socketId} has joined room ${chatId}`);
            });
        });
    }));
    socket.on("joinRoom", (chatId) => __awaiter(void 0, void 0, void 0, function* () {
        socket.join(chatId);
    }));
    socket.on("leaveRoom", (chatId) => __awaiter(void 0, void 0, void 0, function* () {
        socket.leave(chatId);
    }));
    socket.on("delete-message-for-me", (messageId, userId, chatId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const message = chatSchema_1.default.findByIdAndUpdate(chatId, {
                $push: { hidden: userId },
            });
        }
        catch (error) {
            console.log(error);
        }
        socket.emit("message-deleted");
    }));
    socket.on("delete-message-for-everybody", (messageId, participants, chatId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const message = chatSchema_1.default.findByIdAndUpdate(messageId, {
                hidden: participants.reduce((acc, val) => {
                    acc.push(val._id);
                    return acc;
                }, []),
            });
        }
        catch (error) {
            console.log(error);
        }
        socket.to(chatId).emit("message-deleted-for-all");
        socket.emit("message-deleted");
    }));
    socket.on("send-message", (message, chatId) => __awaiter(void 0, void 0, void 0, function* () {
        yield chatSchema_1.default.findByIdAndUpdate(chatId, {
            latestMessage: message,
            $push: { history: message },
        }, { new: true, useFindAndModify: true });
        socket.to(chatId).emit("receive-message", message);
        socket.emit("message-delivered", true);
    }));
    socket.on("im-typing", (chatId) => {
        socket.to(chatId).emit("is-typing");
    });
    socket.on("offline", (userId) => __awaiter(void 0, void 0, void 0, function* () {
        yield userSchema_1.default.findByIdAndUpdate(userId, { "profile.online": false }, { useFindAndModify: false });
        socket.emit("loggedOut", "loggedOut");
        socket.disconnect();
    }));
});
instrument(io, {
    auth: false,
});
exports.default = app_1.default;
