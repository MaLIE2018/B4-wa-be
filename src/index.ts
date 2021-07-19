import mongoose from "mongoose";
import server from "./socket";

export const PORT = process.env.PORT || 3001;

process.env.TS_NODE_DEV && require("dotenv").config();

if (!process.env.MDB_URL) throw new Error("MDB_URL not	set!");

mongoose.connect(process.env.MDB_URL, { useNewUrlParser: true }).then(() => {
  console.log("mongoose connected");
  server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });
});
