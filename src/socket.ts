import server from "./app";
import { Server } from "socket.io";
import UserModel from "./services/user/userSchema";
import ChatModel from "./services/chat/chatSchema";
import { Message } from "./types/interfaces";

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
  console.log(socket.id);

  socket.on("joinRooms", async (rooms: string[]) => {
    rooms.forEach((room) => socket.join(room));
  });

  socket.on("connect", async (userId) => {
    await UserModel.findOneAndUpdate({ _id: userId }, { online: true });
  });

  socket.on("sendMessage", async (message: Message, chatId) => {
    await ChatModel.findOneAndUpdate(
      { _id: chatId },
      {
        $push: { messages: message },
      }
    );
    socket.to(chatId).emit("message", message);
  });
  socket.on("disconnect", async (userId) => {
    await UserModel.findOneAndUpdate({ _id: userId }, { online: false });
  });
});

export default server;
