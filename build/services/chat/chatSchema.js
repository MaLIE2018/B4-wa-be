"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSchema = exports.MessageSchema = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var model = mongoose_1.default.model, Schema = mongoose_1.default.Schema;
exports.MessageSchema = new Schema({
    text: { type: String, required: true },
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true },
    hidden: [{ type: mongoose_1.default.Types.ObjectId, ref: "User", required: true }],
    content: [{ type: String }],
});
exports.ChatSchema = new Schema({
    ownerId: { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true },
    participants: [
        { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true },
    ],
    messages: [exports.MessageSchema],
});
//MessageSchema.pre("save", function () {});
exports.default = model("Chat", exports.ChatSchema);
