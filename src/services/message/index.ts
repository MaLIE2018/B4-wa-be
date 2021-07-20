import express from "express";
import messageModel from "./messageSchema";
import userModel from "../user/userSchema";
const messageRouter = express.Router();

messageRouter.get("/chat/:id", async (req, res, next) => {
  try {
    const messages = await messageModel
      .find({ chatId: req.params.id })
      .populate({
        path: "userId",
        mode: userModel,
        select: {
          profile: { avatar: 1, firstName: 1, lastName: 1 },
          _id: 0,
        },
      });
    if (messages) res.status(200).send(messages);
    else res.status(204).send([]);
  } catch (error) {
    next(error);
  }
});

export default messageRouter;
