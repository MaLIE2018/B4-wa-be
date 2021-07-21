import mongoose from "mongoose";
import { Chat, Message } from "./../../types/interfaces";

const { model, Schema } = mongoose;

const MessageSchema = new Schema<Message>(
  {
    text: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    hidden: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    chatId: { type: String, required: true },
    content: [{ type: String }],
    type: { type: String, default: "text" },
    position: { type: String, enum: ["left", "right"], default: "right" },
    date: { type: Date, default: new Date() },
  },
  { strict: false }
);

export const ChatSchema = new Schema<Chat>({
  participants: [
    { type: mongoose.Types.ObjectId, ref: "User", required: true },
  ],
  owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  name: { type: String },
  latestMessage: { type: Object, default: "" },
  history: [MessageSchema],
});

export default model("Chat", ChatSchema);
