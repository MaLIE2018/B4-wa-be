import server from "./app";
import { Server } from "socket.io";
import UserModel from "./services/user/userSchema";
import { ChatList, Message, Profile } from "./types/interfaces";
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
  socket.on("connect-chats", async (userId, chats: ChatList[]) => {
    try {
      await UserModel.findByIdAndUpdate(
        userId,
        { online: true, "profile.socketId": socket.id },
        { useFindAndModify: false }
      );
    } catch (error) {
      console.log(error);
    }
    chats.forEach((chat) => {
      socket.join(chat.chat._id!);
    });
    socket.emit("loggedIn", "connected");
    console.log(socket.id, socket.rooms);
  });

  socket.on("joinRoom", async (chatId, participants: Profile[]) => {
    participants.map((participant) => {
      const socketId = participant.profile.socketId;
      io.of("/").adapter.on("join-room", (chatId, socketId) => {
        console.log(`socket ${socketId} has joined room ${chatId}`);
      });
    });
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
    let newMessage;
    if (message.chatOwner === message.userId) {
      newMessage = { ...message, position: "right" };
    } else {
      newMessage = { ...message, position: "left" };
    }
    delete newMessage.chatOwner;
    const chat = await ChatModel.findByIdAndUpdate(
      newMessage.chatId,
      {
        latestMessage: newMessage,
        $push: { history: newMessage },
      },
      { new: true, useFindAndModify: true }
    );
    socket.to(message.chatId).emit("receive-message", newMessage);
    // socket.emit("receive-message", nm);
  });

  socket.on("offline", async (userId) => {
    await UserModel.findOneAndUpdate(
      { _id: userId },
      { online: false },
      { useFindAndModify: false }
    );
    socket.emit("loggedOut", "loggedOut");
    socket.disconnect();
  });
});

export default server;
