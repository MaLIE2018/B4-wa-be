import supertest from "supertest";
import mongoose from "mongoose";
import server from "./../socket";
import dotenv from "dotenv";
import { userInput1, userInput2, userInput3 } from "./interfaces";

import { base64 } from "../lib/helper";

dotenv.config();
const request = supertest(server);

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
      mongoose
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

  it("2) It should test if new user can register", async () => {
    const response1 = await request.post("/users/register").send(userInput1);
    user1 = response1.body;

    const response2 = await request.post("/users/register").send(userInput2);
    user2 = response2.body;

    const response3 = await request.post("/users/register").send(userInput3);
    user3 = response3.body;

    expect(response1.status).toBe(201);
    expect(response2.status).toBe(201);
    expect(response3.status).toBe(201);
  });

  //login User
  it("3) It should test if the user can log in with their credentials", async () => {
    const response1 = await request
      .get("/users/login")
      .set(
        "authorization",
        `Basic ${base64(
          [userInput1.profile.email, userInput1.password].join(":")
        )}`
      )
      .send();
    aToken1 = response1.headers["set-cookie"][0].split(";")[0].split("=")[1];
    rToken1 = response1.headers["set-cookie"][1].split(";")[0].split("=")[1];
    const response2 = await request
      .get("/users/login")
      .set(
        "authorization",
        `Basic ${base64(
          [userInput2.profile.email, userInput2.password].join(":")
        )}`
      )
      .send();
    aToken2 = response2.headers["set-cookie"][0].split(";")[0].split("=")[1];
    rToken2 = response2.headers["set-cookie"][1].split(";")[0].split("=")[1];
    const response3 = await request
      .get("/users/login")
      .set(
        "authorization",
        `Basic ${base64(
          [userInput2.profile.email, userInput2.password].join(":")
        )}`
      )
      .send();
    aToken3 = response3.headers["set-cookie"][0].split(";")[0].split("=")[1];
    rToken3 = response3.headers["set-cookie"][1].split(";")[0].split("=")[1];

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    expect(response3.status).toBe(200);
  });

  afterAll((done) => {
    mongoose.connection.dropDatabase().then(() => {
      mongoose.connection.close().then(done);
      console.log("Disconnected");
    });
  });
});
