"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
<<<<<<< HEAD
exports.ChatSchema = exports.MessageSchema = void 0;
=======
exports.ChatSchema = void 0;
>>>>>>> developement
const mongoose_1 = __importDefault(require("mongoose"));
const { model, Schema } = mongoose_1.default;
exports.ChatSchema = new Schema({
    participants: [
        { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true },
    ],
<<<<<<< HEAD
    messages: [exports.MessageSchema],
=======
>>>>>>> developement
    name: { type: String },
    latestMessage: { type: Object, default: "" },
});
<<<<<<< HEAD
//MessageSchema.pre("save", function () {});
=======
>>>>>>> developement
exports.default = model("Chat", exports.ChatSchema);
