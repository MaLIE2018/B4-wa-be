import server from "./app";
import { Server } from "socket.io";

const io = new Server(server, { allowEIO3: true });

io.on("connect", (socket) => {
  console.log(socket.id);
});

export default server;
