import mongoose from "mongoose";

const { model, Schema } = mongoose;

export const MessageSchema = new Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  content: [{ type: String }],
});

export const ChatSchema = new Schema({
  socketId: { type: String },
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  participants: [
    { type: mongoose.Types.ObjectId, ref: "User", required: true },
  ],
  messages: [MessageSchema],
});
