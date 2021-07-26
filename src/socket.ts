import server from "./app";
import { Server } from "socket.io";
import UserModel from "./services/user/userSchema";
import { Chat, Message, Profile } from "./types/interfaces";
import ChatModel from "./services/chat/chatSchema";
import { SocketAddress } from "node:net";
const { instrument } = require("@socket.io/admin-ui");

const io = new Server(server, {
  cors: {
    origin: [
      process.env.FE_URL!,
      process.env.FE_DEV_URL!,
      "https://admin.socket.io/",
      process.env.FE_GOOGLE_URL!,
      process.env.FE_GOOGLE_REDIRECT_URL!,
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
  allowEIO3: true,
});

io.on("connection", (socket) => {
  socket.on("connect", async (userId) => {
    try {
      await UserModel.findByIdAndUpdate(userId, {
        "profile.socketId": socket.id,
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("give-me-my-socket-id", async (userId) => {
    try {
      await UserModel.findByIdAndUpdate(userId, {
        "profile.socketId": socket.id,
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("connect-chats", async (userId, chats: Chat[]) => {
    try {
      await UserModel.findByIdAndUpdate(userId, {
        "profile.socketId": socket.id,
      });
    } catch (error) {
      console.log(error);
    }
    if (chats.length > 0) {
      chats.forEach((chat) => {
        if (chat?._id) {
          socket.join(chat._id!);
        }
      });
      chats.forEach((chat) => {
        if (chat?._id) {
          socket.to(chat._id).emit("logged-in", chat._id);
        }
      });
    }
  });

  socket.on(
    "participants-Join-room",
    async (chatId, participants: Profile[]) => {
      const socketList = await io.sockets.allSockets();
      participants.map((participant) => {
        const socketId = participant.profile.socketId;
        if ([...socketList].includes(socketId)) {
          socket.to(socketId).emit("new-chat", chatId);
        }
      });
    }
  );
  socket.on("room-deleted", async (chatId) => {
    socket.to(chatId).emit("deleted-chat");
  });

  socket.on("join-room", async (chatId) => {
    socket.join(chatId);
  });

  socket.on("leave-room", async (chatId) => {
    socket.leave(chatId);
  });

  socket.on("delete-message", async (messageId, chatId) => {
    try {
      const message = await ChatModel.findByIdAndUpdate(
        chatId,
        {
          $pull: { history: { _id: messageId } },
        },
        { useFindAndModify: false }
      );
      socket.to(chatId).emit("message-deleted", messageId, chatId);
      socket.emit("message-deleted", messageId, chatId);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("send-message", async (message: Message, chatId: string) => {
    try {
      const newMessage = await ChatModel.findByIdAndUpdate(
        chatId,
        {
          latestMessage: { ...message, status: "received" },
          $push: { history: { ...message, status: "received" } },
        },
        { new: true, useFindAndModify: false }
      );
      socket
        .to(chatId)
        .emit("receive-message", newMessage.latestMessage, chatId);
      socket.emit("message-delivered", newMessage.latestMessage.date, chatId);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("im-typing", (chatId: string) => {
    socket.to(chatId).emit("is-typing", chatId);
  });
  socket.on("i-stopped-typing", (chatId: string) => {
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

export default server;
