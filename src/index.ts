import mongoose from "mongoose";

process.env.TS_NODE_DEV && require("dotenv").config();

import server from "./socket";

export const PORT = process.env.PORT || 3001;

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
