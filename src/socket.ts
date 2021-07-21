import server from "./app";
import { Server } from "socket.io";
import UserModel from "./services/user/userSchema";
import { Chat, Message } from "./types/interfaces";
import ChatModel from "./services/chat/chatSchema";
import mongoose from "mongoose";

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
  console.log(socket.id);
  socket.on("connect-chats", async (userId, chats: Chat[]) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        await UserModel.findByIdAndUpdate(
          userId,
          { online: true },
          { useFindAndModify: false }
        );
      }
    } catch (error) {
      console.log(error);
    }
    chats.forEach((chat) => {
      socket.join(chat._id!);
    });
    socket.emit("loggedIn", "connected");
    console.log(socket.rooms);
  });

  socket.on("joinRoom", async (chatId) => {
    socket.join(chatId);
  });

  socket.on("leaveRoom", async (chatId) => {
    socket.leave(chatId);
  });

  socket.on("delete-message-for-me", async (messageId, userId, chatId) => {
    try {
      const message = ChatModel.findByIdAndUpdate(chatId, {
        $push: { hidden: { userId } },
      });
    } catch (error) {
      console.log(error);
    }
    socket.emit("message-deleted");
  });

  socket.on(
    "delete-message-for-everybody",
    async (messageId, participants, chatId) => {
      try {
        const message = ChatModel.findByIdAndUpdate(messageId, {
          hidden: participants.reduce((acc: string[], val: any) => {
            acc.push(val._id);
            return acc;
          }, []),
        });
      } catch (error) {
        console.log(error);
      }
      socket.to(chatId).emit("message-deleted-for-all");
      socket.emit("message-deleted");
    }
  );

  socket.on("send-message", async (message: Message) => {
    await ChatModel.findByIdAndUpdate(
      message.chatId,
      {
        latestMessage: message,
        $push: { history: { message } },
      },
      { useFindAndModify: false }
    );
    socket.to(message.chatId).emit("receive-message", message);
    // socket.emit("receive-message", nm);
  });

  socket.on("offline", async (userId) => {
    await UserModel.findOneAndUpdate(
      { _id: userId },
      { online: false },
      { useFindAndModify: false }
    );
    socket.emit("loggedOut", "loggedOut");
  });
});

export default server;
