import mongoose from "mongoose";
import { Chat, Message } from "./../../types/interfaces";

const { model, Schema } = mongoose;

export const MessageSchema = new Schema<Message>({
  text: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
  hidden: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  content: [{ type: String }],
});

export const ChatSchema = new Schema<Chat>({
  participants: [
    { type: mongoose.Types.ObjectId, ref: "User", required: true },
  ],
  messages: [MessageSchema],
  name: { type: String },
});

export default model("Chat", ChatSchema);
