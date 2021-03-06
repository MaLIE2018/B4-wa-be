"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { model, Schema } = mongoose_1.default;
const MessageSchema = new Schema({
    text: { type: String, required: true },
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    status: {
        type: String,
        enum: ["received", "waiting"],
        default: "received",
    },
    image: { type: String },
    content: [{ type: String }],
    type: { type: String, enum: ["text", "photo"], default: "text" },
    date: { type: Date },
}, { strict: false });
exports.ChatSchema = new Schema({
    participants: [
        { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true },
    ],
    owner: { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true },
    name: { type: String, default: "" },
    latestMessage: { type: Object, default: "" },
    history: [MessageSchema],
});
exports.default = model("Chat", exports.ChatSchema);
