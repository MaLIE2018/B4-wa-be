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
        origin: [
            process.env.FE_URL,
            process.env.FE_DEV_URL,
            "https://admin.socket.io/",
        ],
        methods: ["GET", "POST", "DELETE", "PUT"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
    allowEIO3: true,
});
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
                socket.join(chat.chat._id);
            });
            chats.forEach((chat) => {
                socket.to(chat.chat._id).emit("logged-in", chat.chat._id);
            });
        }
    }));
    socket.on("participants-Join-room", (chatId, participants) => __awaiter(void 0, void 0, void 0, function* () {
        const socketList = yield io.sockets.allSockets();
        console.log("socketList:", socketList);
        participants.map((participant) => {
            console.log(participant);
            const socketId = participant.profile.socketId;
            console.log("socketId:", socketId);
            if ([...socketList].includes(socketId)) {
                socket.to(socketId).emit("new-chat", chatId);
                console.log();
            }
        });
    }));
    socket.on("join-room", (chatId) => __awaiter(void 0, void 0, void 0, function* () {
        socket.join(chatId);
    }));
    socket.on("leave-room", (chatId) => __awaiter(void 0, void 0, void 0, function* () {
        socket.leave(chatId);
    }));
    socket.on("delete-message", (messageId, chatId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const message = yield chatSchema_1.default.findOneAndDelete({
                _id: chatId,
                "history._id": messageId,
            });
        }
        catch (error) {
            console.log(error);
        }
        socket.to(chatId).emit("message-deleted", messageId, chatId);
        socket.emit("message-deleted");
    }));
    socket.on("send-message", (message, chatId) => __awaiter(void 0, void 0, void 0, function* () {
        const newMessage = Object.assign(Object.assign({}, message), { status: "received" });
        yield chatSchema_1.default.findByIdAndUpdate(chatId, {
            latestMessage: newMessage,
            $push: { history: message },
        }, { new: true, useFindAndModify: true });
        socket.to(chatId).emit("receive-message", message, chatId);
        socket.emit("message-delivered", newMessage.date, chatId);
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
instrument(io, {
    auth: false,
});
exports.default = app_1.default;
