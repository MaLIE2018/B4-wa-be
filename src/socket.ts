import server from "./app";
import { Server } from "socket.io";
import UserModel from "./services/user/userSchema";
import ChatModel from "./services/chat/chatSchema";
import { ChatList, Message } from "./types/interfaces";

const io = new Server(server, {
  cors: {
    origin: process.env.FE_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
  allowEIO3: true,
});

io.on("connect", (socket) => {
  socket.on("connect", async (userId, rooms: ChatList[]) => {
    await UserModel.findByIdAndUpdate(
      userId,
      { online: true },
      { useFindAndModify: false }
    );
    rooms.forEach((room) => {
      if (!room.hidden) socket.join(room.chatId);
    });
  });
  //Can I use nested Socket calls?

  socket.on("sendMessage", async (message: Message, chatId) => {
    await ChatModel.findByIdAndUpdate(
      { _id: chatId },
      {
        $push: { messages: message },
      },
      { useFindAndModify: false }
    );
    socket.to(chatId).emit("message", message);
  });

  socket.on("disconnect", async (userId) => {
    await UserModel.findOneAndUpdate({ _id: userId }, { online: false });
  });
});

export default server;
