import express, { NextFunction, Response } from "express";
import { JWTMiddleWare } from "../../lib/auth/auth";
import { ChatList } from "../../types/interfaces";
import ChatModel from "../chat/chatSchema";
import UserModel from "../user/userSchema";
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const chatRouter = express.Router();

//Get all my Chats
chatRouter.get("/me", async (req, res, next) => {
  try {
    const chats = await ChatModel.find(
      { participants: req.user._id },
      { history: 0 }
    ).populate("participants", { profile: 1 });
    res.status(200).send(chats);
  } catch (error) {
    next(error);
  }
});

chatRouter.post("/", async (req, res, next) => {
  try {
    const matchIt = await ChatModel.findOne({
      participants: [...req.body.participants, req.user._id],
    });
    if (matchIt === null) {
      const chat = new ChatModel({
        ...req.body,
        participants: [...req.body.participants, req.user._id],
        owner: req.user._id,
      });
      await chat.save();
      await Promise.all(
        chat.participants.map(
          async (participantId: string) =>
            await UserModel.findByIdAndUpdate(
              participantId,
              {
                $push: { chats: { caht: chat._id } },
              },
              { useFindAndModify: false }
            )
        )
      );
      res.status(200).send(chat);
    } else {
      res.status(200).send(matchIt);
    }
  } catch (error) {
    next(error);
  }
});

//Get Chat messages by ID
chatRouter.get("/:id", async (req, res, next) => {
  try {
    const chat = await ChatModel.findById(req.params.id, { history: 1 });
    if (chat) res.status(200).send(chat);
    else res.status(404).send();
  } catch (error) {
    next(error);
  }
});

//Delete Chat
chatRouter.delete("/:id", async (req, res, next) => {
  try {
    req.user.chats = req.user.chats.map((c: ChatList) => {
      if (c.chat.toString() === req.params.id.toString()) {
        c.hidden = true;
        return c;
      }
      return c;
    });
    req.user.save();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Chat participants
chatRouter.post("/:id/participants/:participantId", async (req, res, next) => {
  try {
    const chat = await ChatModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { participants: req.params.participantId },
      },
      { useFindAndModify: false }
    );
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

chatRouter.delete(
  "/:id/participants/:participantId",
  async (req, res, next) => {
    try {
      const chat = await ChatModel.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { participants: req.params.participantId },
        },
        { useFindAndModify: false }
      );
      const user = await UserModel.findByIdAndUpdate(
        req.params.participantId,
        {
          $pull: { chats: { chatId: req.params.id } },
        },
        { useFindAndModify: false }
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECTRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "chat",
  },
});

const upload = multer({ storage: storage }).single("img");

chatRouter.put(
  "/upload",
  JWTMiddleWare,
  upload,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      // req.user.profile.avatar = req.file.path;
      await req.user.save();
      res.status(200).send({image: req.file.path });
    } catch (error: any) {
      console.log(error);
      next(error);
      // next(createError(500, {message: error.message}));
    }
  }
);

export default chatRouter;
