"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorhandler_1 = __importDefault(require("./lib/errorhandler"));
const http_1 = require("http");
const services_1 = __importDefault(require("./services"));
const passport_1 = __importDefault(require("passport"));
const http_errors_1 = __importDefault(require("http-errors"));
const app = express_1.default();
const originsURLS = [
    process.env.FE_URL,
    process.env.FE_DEV_URL,
    process.env.FE_GOOGLE_URL,
    process.env.FE_GOOGLE_REDIRECT_URL,
];
const corsOptions = {
    origin: function (origin, next) {
        if (originsURLS.includes(origin)) {
            next(null, true);
        }
        else {
            console.log("origin403:", origin);
            next(http_errors_1.default(403, { message: "Check your cors settings!" }));
        }
    },
    credentials: true,
};
app.use(cors_1.default(corsOptions));
app.use(express_1.default.json());
app.use(cookie_parser_1.default());
app.use(passport_1.default.initialize());
const server = http_1.createServer(app);
app.use("/", services_1.default);
app.use(errorhandler_1.default);
exports.default = server;
