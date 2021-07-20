"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSchema = exports.MessageSchema = void 0;
<<<<<<< HEAD
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
=======
const mongoose_1 = __importDefault(require("mongoose"));
const { model, Schema } = mongoose_1.default;
exports.MessageSchema = new Schema({
    text: { type: String, required: true },
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    hidden: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }],
    content: [{ type: String }],
});
exports.ChatSchema = new Schema({
>>>>>>> developement
    participants: [
        { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true },
    ],
    messages: [exports.MessageSchema],
<<<<<<< HEAD
});
//MessageSchema.pre("save", function () {});
=======
    name: { type: String },
});
exports.MessageSchema.pre("save", function () { });
>>>>>>> developement
exports.default = model("Chat", exports.ChatSchema);
