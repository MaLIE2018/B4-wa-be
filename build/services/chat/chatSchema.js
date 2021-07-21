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
    hidden: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }],
    content: [{ type: String }],
}, { timestamps: true });
exports.ChatSchema = new Schema({
    participants: [
        { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true },
    ],
    name: { type: String },
    latestMessage: { type: Object, default: "" },
    history: [MessageSchema],
});
exports.default = model("Chat", exports.ChatSchema);
