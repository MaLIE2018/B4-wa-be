import supertest from "supertest";
import mongoose from "mongoose";
import server from "./../socket";
import dotenv from "dotenv";

dotenv.config();
const request = supertest(server);

describe("test environment", () => {
  beforeAll((done) => {
    mongoose
      .connect(process.env.MDB_TEST_URL!, { useNewUrlParser: true })
      .then(() => {
        console.log("Connected to Atlas");
        done();
      });
  });

  it("should be that true is true", () => {
    expect(true).toBe(true);
  });

  afterAll((done) => {
    mongoose.connection.dropDatabase().then(() => {
      mongoose.connection.close().then(done);
      console.log("Disconnected");
    });
  });
});
