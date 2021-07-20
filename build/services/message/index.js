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
const messageSchema_1 = __importDefault(require("./messageSchema"));
const userSchema_1 = __importDefault(require("../user/userSchema"));
const messageRouter = express_1.default.Router();
messageRouter.get("/chat/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield messageSchema_1.default
            .find({ chatId: req.params.id })
            .populate({
            path: "userId",
            mode: userSchema_1.default,
            select: {
                profile: { avatar: 1, firstName: 1, lastName: 1 },
                _id: 0,
            },
        });
        if (messages)
            res.status(200).send(messages);
        else
            res.status(204).send([]);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = messageRouter;
