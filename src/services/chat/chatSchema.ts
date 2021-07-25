import mongoose from "mongoose";
import { Chat, Message } from "./../../types/interfaces";

const { model, Schema } = mongoose;

const MessageSchema = new Schema<Message>(
  {
    text: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["received", "waiting"],
      default: "received",
    },
    image: { type: String },
    content: [{ type: String }],
    type: { type: String, enum: ["text", "photo"], default: "text" },
    date: { type: Date },
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
