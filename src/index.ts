import mongoose from "mongoose";
import server from "./socket";
import crypto from "crypto";

export const PORT = process.env.PORT || 3001;

process.env.TS_NODE_DEV && require("dotenv").config();

if (!process.env.MDB_URL) throw new Error("MDB_URL not	set!");

mongoose
  .connect(process.env.MDB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("mongoose connected");
    server.listen(PORT, () => {
      console.table({ "Server running on port ": PORT });
    });
  });
