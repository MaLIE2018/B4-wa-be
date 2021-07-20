import server from "./app";
import { Server } from "socket.io";
import UserModel from "./services/user/userSchema";
import ChatModel from "./services/chat/chatSchema";
import { ChatList, extendedMessage, Message } from "./types/interfaces";
import { isSemicolonClassElement } from "typescript";

const io = new Server(server, {
  cors: {
    origin: process.env.FE_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
  allowEIO3: true,
});

io.on("connection", (socket) => {
  socket.on("connect", async (userId, chats: ChatList[]) => {
    await UserModel.findByIdAndUpdate(
      userId as string,
      { online: true },
      { useFindAndModify: false }
    );
    chats.forEach((chat) => {
      socket.join(chat.chatId);
    });
    socket.emit("loggedIn");
  });

  socket.on("joinRoom", async (chatId) => {
    socket.join(chatId);
    console.log("Rooms", socket.rooms);
  });

  socket.on("leaveRoom", async (chatId) => {
    socket.leave(chatId);
    console.log("newChat", socket.rooms);
  });

  socket.on("sendMessage", async (message: extendedMessage) => {
    await ChatModel.findByIdAndUpdate(
      message.chatId,
      {
        $push: { messages: message },
      },
      { useFindAndModify: false }
    );
    socket.to(message.chatId).emit("message", "test");
    socket.emit("message", message.text);
  });

  socket.on("disconnect", async (userId) => {
    await UserModel.findOneAndUpdate({ _id: userId }, { online: false });
  });
});

export default server;
