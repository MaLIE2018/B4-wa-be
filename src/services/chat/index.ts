import express from "express";
import { nextTick } from "node:process";
import { ChatList } from "../../types/interfaces";
import ChatModel from "../chat/chatSchema";
import UserModel from "../user/userSchema";
const chatRouter = express.Router();

//Get all my Chats
chatRouter.get("/me", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (user !== null) {
      res.status(200).send(user.chats.filter((c) => c.hidden === false));
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});
chatRouter.post("/", async (req, res, next) => {
  try {
    const matchIt = await ChatModel.find({
      participants: req.body.participants,
    });
    if (matchIt.length === 0) {
      const chat = new ChatModel(req.body);
      await chat.save();
      await Promise.all(
        chat.participants.map(
          async (participantId: string) =>
            await UserModel.findByIdAndUpdate(
              participantId,
              {
                $push: { chats: { chatId: chat._id } },
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

//Get Chat by ID
chatRouter.get("/:id", async (req, res, next) => {
  try {
    const chat = await ChatModel.findById(req.params.id);
    if (chat) res.status(200).send({ chat });
    else res.status(404).send();
  } catch (error) {
    next(error);
  }
  res.status(200).send();
});

//Delete Chat
chatRouter.delete("/:id", async (req, res, next) => {
  try {
    req.user.chats = req.user.chats.map((c: ChatList) => {
      if (c.chatId.toString() === req.params.id.toString()) {
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

export default chatRouter;
