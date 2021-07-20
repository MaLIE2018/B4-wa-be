import server from "./app";
import { Server } from "socket.io";
import UserModel from "./services/user/userSchema";
import MessageModel from "./services/message/messageSchema";
import { ChatList, Message } from "./types/interfaces";
import ChatModel from "./services/chat/chatSchema";

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
      socket.join(chat.chat);
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

  socket.on("sendMessage", async (message: Message) => {
    const nm = new MessageModel(message);
    await nm.save();
    await ChatModel.findByIdAndUpdate(message.chatId, {
      latestMessage: nm,
    });
    socket.to(message.chatId).emit("message", "test");
    socket.emit("message", message.text);
  });

  socket.on("disconnect", async (userId) => {
    await UserModel.findOneAndUpdate({ _id: userId }, { online: false });
  });
});

export default server;
