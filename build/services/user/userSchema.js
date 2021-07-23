"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const { model, Schema } = mongoose_1.default;
const ChatsReferenceSchema = new Schema({
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    hidden: { type: Boolean, default: false },
}, { _id: false });
const UserSchema = new Schema({
    profile: {
        username: { type: String },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        socketId: { type: String, default: "" },
        lastSeen: { type: Date },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        avatar: { type: String, default: "https://source.unsplash.com/random" },
        online: { type: Boolean, default: false },
    },
    password: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    refreshToken: { type: String },
    chats: [ChatsReferenceSchema],
}, { timestamps: true, strict: false });
UserSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();
    delete userObj.refreshToken;
    delete userObj.password;
    delete userObj.__v;
    return userObj;
};
UserSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const newUser = this;
        if (newUser.isModified("password")) {
            newUser.password = yield bcrypt_1.default.hash(newUser.password, 10);
        }
    });
});
UserSchema.static("checkCredentials", function checkCredentials(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ "profile.email": email })
            .populate("friends", {
            profile: 1,
        })
            .populate({
            path: "chats.chat",
            select: { participants: 1, latestMessage: 1 },
            populate: {
                path: "participants",
                select: "profile",
            },
        });
        if (user) {
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (isMatch) {
                user.chats = user.chats.filter((c) => c.hidden === false);
                yield user.save();
                return user;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    });
});
exports.default = model("User", UserSchema);
