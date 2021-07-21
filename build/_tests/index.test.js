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
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_1 = __importDefault(require("./../socket"));
const dotenv_1 = __importDefault(require("dotenv"));
const interfaces_1 = require("./interfaces");
const helper_1 = require("../lib/helper");
dotenv_1.default.config();
const request = supertest_1.default(socket_1.default);
let user1;
let user2;
let user3;
let aToken1 = "";
let rToken1 = "";
let aToken2 = "";
let rToken2 = "";
let aToken3 = "";
let rToken3 = "";
describe("test environment", () => {
    beforeAll((done) => {
        if (process.env.MDB_TEST_URL !== undefined) {
            mongoose_1.default
                .connect(process.env.MDB_TEST_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
                .then(() => {
                console.log("Connected to Atlas");
                done();
            });
        }
    });
    it("1) should be that true is true", () => {
        expect(true).toBe(true);
    });
    it("2) It should test if new user can register", () => __awaiter(void 0, void 0, void 0, function* () {
        const response1 = yield request.post("/users/register").send(interfaces_1.userInput1);
        user1 = response1.body;
        const response2 = yield request.post("/users/register").send(interfaces_1.userInput2);
        user2 = response2.body;
        const response3 = yield request.post("/users/register").send(interfaces_1.userInput3);
        user3 = response3.body;
        expect(response1.status).toBe(201);
        expect(response2.status).toBe(201);
        expect(response3.status).toBe(201);
    }));
    //login User
    it("3) It should test if the user can log in with their credentials", () => __awaiter(void 0, void 0, void 0, function* () {
        const response1 = yield request
            .get("/users/login")
            .set("authorization", `Basic ${helper_1.base64([interfaces_1.userInput1.profile.email, interfaces_1.userInput1.password].join(":"))}`)
            .send();
        aToken1 = response1.headers["set-cookie"][0].split(";")[0].split("=")[1];
        rToken1 = response1.headers["set-cookie"][1].split(";")[0].split("=")[1];
        const response2 = yield request
            .get("/users/login")
            .set("authorization", `Basic ${helper_1.base64([interfaces_1.userInput2.profile.email, interfaces_1.userInput2.password].join(":"))}`)
            .send();
        aToken2 = response2.headers["set-cookie"][0].split(";")[0].split("=")[1];
        rToken2 = response2.headers["set-cookie"][1].split(";")[0].split("=")[1];
        const response3 = yield request
            .get("/users/login")
            .set("authorization", `Basic ${helper_1.base64([interfaces_1.userInput2.profile.email, interfaces_1.userInput2.password].join(":"))}`)
            .send();
        aToken3 = response3.headers["set-cookie"][0].split(";")[0].split("=")[1];
        rToken3 = response3.headers["set-cookie"][1].split(";")[0].split("=")[1];
        expect(response1.status).toBe(200);
        expect(response2.status).toBe(200);
        expect(response3.status).toBe(200);
    }));
    afterAll((done) => {
        mongoose_1.default.connection.dropDatabase().then(() => {
            mongoose_1.default.connection.close().then(done);
            console.log("Disconnected");
        });
    });
});
