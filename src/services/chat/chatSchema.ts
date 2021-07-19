import mongoose from "mongoose";
import { Chat, Message } from "./../../types/interfaces";

const { model, Schema } = mongoose;

export const MessageSchema = new Schema<Message>({
  text: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  hidden: [{ type: mongoose.Types.ObjectId, ref: "User", required: true }],
  content: [{ type: String }],
});

export const ChatSchema = new Schema<Chat>({
  ownerId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  participants: [
    { type: mongoose.Types.ObjectId, ref: "User", required: true },
  ],
  messages: [MessageSchema],
});

MessageSchema.pre("save", function () {});

export default model("Chat", ChatSchema);
