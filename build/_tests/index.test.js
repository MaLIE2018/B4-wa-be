"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_1 = __importDefault(require("./../socket"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const request = supertest_1.default(socket_1.default);
describe("test environment", () => {
    beforeAll((done) => {
        mongoose_1.default
            .connect(process.env.MDB_TEST_URL, { useNewUrlParser: true })
            .then(() => {
            console.log("Connected to Atlas");
            done();
        });
    });
    it("should be that true is true", () => {
        expect(true).toBe(true);
    });
    afterAll((done) => {
        mongoose_1.default.connection.dropDatabase().then(() => {
            mongoose_1.default.connection.close().then(done);
            console.log("Disconnected");
        });
    });
});
