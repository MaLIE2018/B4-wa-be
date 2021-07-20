"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSchema = exports.MessageSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { model, Schema } = mongoose_1.default;
exports.MessageSchema = new Schema({
    text: { type: String, required: true },
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    hidden: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }],
    content: [{ type: String }],
});
exports.ChatSchema = new Schema({
    participants: [
        { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true },
    ],
    messages: [exports.MessageSchema],
    name: { type: String },
});
//MessageSchema.pre("save", function () {});
exports.default = model("Chat", exports.ChatSchema);
