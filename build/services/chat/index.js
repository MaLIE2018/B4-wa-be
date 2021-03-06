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
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../lib/auth/auth");
const chatSchema_1 = __importDefault(require("../chat/chatSchema"));
const userSchema_1 = __importDefault(require("../user/userSchema"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer = require("multer");
const chatRouter = express_1.default.Router();
//Get all my Chats
chatRouter.get("/me", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = yield chatSchema_1.default.find({ participants: req.user._id }, { history: 0 }).populate("participants", { profile: 1 });
        res.status(200).send(chats);
    }
    catch (error) {
        next(error);
    }
}));
chatRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const matchIt = yield chatSchema_1.default.findOne({
            participants: [...req.body.participants, req.user._id],
        }).populate("participants", { profile: 1 });
        if (matchIt === null) {
            const chat = new chatSchema_1.default(Object.assign(Object.assign({}, req.body), { participants: [...req.body.participants, req.user._id], owner: req.user._id }));
            yield chat.save();
            yield Promise.all(chat.participants.map((participantId) => __awaiter(void 0, void 0, void 0, function* () {
                return yield userSchema_1.default.findByIdAndUpdate(participantId, {
                    $push: { chats: chat._id },
                }, { useFindAndModify: false });
            })));
            const newChat = yield chatSchema_1.default.findById(chat._id).populate("participants", { profile: 1 });
            res.status(200).send(newChat);
        }
        else {
            res.status(200).send(matchIt);
        }
    }
    catch (error) {
        next(error);
    }
}));
//Get Chat messages by ID
chatRouter.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield chatSchema_1.default.findById(req.params.id, { history: 1 });
        if (chat)
            res.status(200).send(chat);
        else
            res.status(404).send();
    }
    catch (error) {
        next(error);
    }
}));
//Delete Chat
chatRouter.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield chatSchema_1.default.findByIdAndDelete(req.params.id, {});
        if (chat) {
            yield Promise.all(chat.participants.map((participantId) => __awaiter(void 0, void 0, void 0, function* () {
                return yield userSchema_1.default.findByIdAndUpdate(participantId, {
                    $pull: { chats: chat._id },
                }, { useFindAndModify: false });
            })));
            res.status(204).send();
        }
        else {
            res.status(404).send({ message: "Not Found" });
        }
    }
    catch (error) {
        next(error);
    }
}));
// Chat participants
chatRouter.post("/:id/participants/:participantId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield chatSchema_1.default.findByIdAndUpdate(req.params.id, {
            $addToSet: { participants: req.params.participantId },
        }, { useFindAndModify: false });
        res.status(200).send();
    }
    catch (error) {
        next(error);
    }
}));
chatRouter.delete("/:id/participants/:participantId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield chatSchema_1.default.findByIdAndUpdate(req.params.id, {
            $pull: { participants: req.params.participantId },
        }, { useFindAndModify: false });
        const user = yield userSchema_1.default.findByIdAndUpdate(req.params.participantId, {
            $pull: { chats: { chatId: req.params.id } },
        }, { useFindAndModify: false });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECTRET,
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: "chat",
    },
});
const upload = multer({ storage: storage }).single("img");
chatRouter.put("/upload", auth_1.JWTMiddleWare, upload, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield req.user.save();
        res.status(200).send({ image: req.file.path });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
exports.default = chatRouter;
