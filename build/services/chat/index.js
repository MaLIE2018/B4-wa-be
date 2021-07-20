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
<<<<<<< HEAD
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
=======
>>>>>>> developement
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
<<<<<<< HEAD
var express_1 = __importDefault(require("express"));
var chatRouter = express_1.default.Router();
//Get all my Chats
chatRouter.get("/", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("test");
        res.status(200).send();
        return [2 /*return*/];
    });
}); });
chatRouter.post("/", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
        }
        catch (error) {
            next(error);
        }
        res.status(200).send();
        return [2 /*return*/];
    });
}); });
//Get Chat by ID
chatRouter.get("/:id", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
        }
        catch (error) {
            next(error);
        }
        res.status(200).send();
        return [2 /*return*/];
    });
}); });
//Delete Chat
chatRouter.delete("/:id", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
        }
        catch (error) {
            next(error);
        }
        res.status(200).send();
        return [2 /*return*/];
    });
}); });
// Chat participants
chatRouter.post("/:id/participants", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
        }
        catch (error) {
            next(error);
        }
        res.status(200).send();
        return [2 /*return*/];
    });
}); });
chatRouter.delete("/:id/participants/:id", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
        }
        catch (error) {
            next(error);
        }
        res.status(200).send();
        return [2 /*return*/];
    });
}); });
=======
const express_1 = __importDefault(require("express"));
const chatSchema_1 = __importDefault(require("../chat/chatSchema"));
const userSchema_1 = __importDefault(require("../user/userSchema"));
const chatRouter = express_1.default.Router();
//Get all my Chats
chatRouter.get("/me", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userSchema_1.default.findById(req.user._id);
        if (user !== null) {
            res.status(200).send(user.chats.filter((c) => c.hidden === false));
        }
        else {
            next();
        }
    }
    catch (error) {
        next(error);
    }
}));
chatRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const matchIt = yield chatSchema_1.default.find({
            participants: req.body.participants,
        });
        if (matchIt.length === 0) {
            const chat = new chatSchema_1.default(req.body);
            yield chat.save();
            yield Promise.all(chat.participants.map((participantId) => __awaiter(void 0, void 0, void 0, function* () {
                return yield userSchema_1.default.findByIdAndUpdate(participantId, {
                    $push: { chats: { chatId: chat._id } },
                }, { useFindAndModify: false });
            })));
            res.status(200).send(chat);
        }
        else {
            res.status(200).send(matchIt);
        }
    }
    catch (error) {
        next(error);
    }
}));
//Get Chat by ID
chatRouter.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield chatSchema_1.default.findById(req.params.id);
        if (chat)
            res.status(200).send({ chat });
        else
            res.status(404).send();
    }
    catch (error) {
        next(error);
    }
    res.status(200).send();
}));
//Delete Chat
chatRouter.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.user.chats = req.user.chats.map((c) => {
            if (c.chatId.toString() === req.params.id.toString()) {
                c.hidden = true;
                return c;
            }
            return c;
        });
        req.user.save();
        res.status(204).send();
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
>>>>>>> developement
exports.default = chatRouter;
