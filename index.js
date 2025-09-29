const express = require("express");
const { Socket } = require("dgram");
const http = require("http");
const socketio = require("socket.io");
const GameSession = require("./GameSession");
const app = express();
const Player = require("./Player");
const server = http.createServer(app);

const io = new socketio.Server(server);
const PORT = 3000;
const gameSession = new GameSession(io);
//serve html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", (event) => {
    gameSession.joinGame({ event, socket });
  });

  socket.on("disconnect", () => {
    gameSession.exit({ socket });
    console.log("Client disconnected");
  });
 
});
  
server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
