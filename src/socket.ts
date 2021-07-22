import server from "./app";
import { Server } from "socket.io";
import UserModel from "./services/user/userSchema";
import { ChatList, Message, Profile } from "./types/interfaces";
import ChatModel from "./services/chat/chatSchema";
import { SocketAddress } from "node:net";
const { instrument } = require("@socket.io/admin-ui");

const io = new Server(server, {
  cors: {
    origin: [
      process.env.FE_URL!,
      process.env.FE_DEV_URL!,
      "https://admin.socket.io/",
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
  allowEIO3: true,
});

io.on("connection", (socket) => {
  socket.on("connect-chats", async (userId, chats: ChatList[]) => {
    try {
      await UserModel.findByIdAndUpdate(userId, {
        "profile.socketId": socket.id,
      });
    } catch (error) {
      console.log(error);
    }
    if (chats.length > 0) {
      chats.forEach((chat) => {
        socket.join(chat.chat._id!);
      });
      chats.forEach((chat) => {
        socket.to(chat.chat._id).emit("logged-in", chat.chat._id);
      });
    }
  });

  socket.on(
    "participants-Join-room",
    async (chatId, participants: Profile[]) => {
      participants.map((participant) => {
        const socketId = participant.profile.socketId;
        io.of("/").adapter.on("join-room", (chatId, socketId) => {
          console.log(`socket ${socketId} has joined room ${chatId}`);
        });
      });
    }
  );

  socket.on("join-room", async (chatId) => {
    socket.join(chatId);
  });

  socket.on("leave-room", async (chatId) => {
    socket.leave(chatId);
  });

  socket.on("delete-message-for-me", async (messageId, userId, chatId) => {
    try {
      const message = ChatModel.findByIdAndUpdate(chatId, {
        $push: { hidden: userId },
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
      socket.to(chatId).emit("message-deleted-for-all", chatId);
      socket.emit("message-deleted");
    }
  );

  socket.on("send-message", async (message: Message, chatId: string) => {
    await ChatModel.findByIdAndUpdate(
      chatId,
      {
        latestMessage: { ...message, date: new Date() },
        $push: { history: message },
      },
      { new: true, useFindAndModify: true }
    );
    socket.to(chatId).emit("receive-message", message, chatId);
    socket.emit("message-delivered", true);
  });

  socket.on("im-typing", (chatId: string) => {
    console.log("chatId:", chatId);
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
