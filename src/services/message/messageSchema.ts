import mongoose from "mongoose";
import { Message } from "../../types/interfaces";

const { model, Schema } = mongoose;

const MessageSchema = new Schema<Message>(
  {
    text: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    hidden: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    content: [{ type: String }],
    chatId: { type: mongoose.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);

export default model("Message", MessageSchema);
