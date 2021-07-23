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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const userSchema_1 = __importDefault(require("../../services/user/userSchema"));
const tools_1 = require("./tools");
passport_1.default.use("google", new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "https://whatsappclone-mu.vercel.app/users/googleRedirect",
}, (accessToken, refreshToken, profile, passportNext) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("profile:", profile);
        const user = yield userSchema_1.default.findOne({
            "profile.email": profile.emails[0].value,
        });
        if (user) {
            const tokens = yield tools_1.JWTAuthenticate(user);
            passportNext(null, { user, tokens });
        }
        else {
            const newUser = {
                profile: {
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                },
            };
            const createdUser = new userSchema_1.default(newUser);
            const savedUser = yield createdUser.save();
            const tokens = yield tools_1.JWTAuthenticate(savedUser);
            passportNext(null, { user: savedUser, tokens });
        }
    }
    catch (error) {
        passportNext(error);
    }
})));
passport_1.default.serializeUser(function (user, passportNext) {
    // this is for req.user
    passportNext(null, user);
});
exports.default = passport_1.default;
