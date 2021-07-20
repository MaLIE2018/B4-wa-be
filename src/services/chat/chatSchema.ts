import mongoose from "mongoose";
import { Chat } from "./../../types/interfaces";

const { model, Schema } = mongoose;

export const ChatSchema = new Schema<Chat>({
  participants: [
    { type: mongoose.Types.ObjectId, ref: "User", required: true },
  ],
  name: { type: String },
  latestMessage: { type: Object, default: "" },
});

export default model("Chat", ChatSchema);
