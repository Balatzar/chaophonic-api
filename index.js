const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const cors = require("cors");

app.use(cors());

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  const room = socket.handshake.query.room;
  console.log(io.sockets.adapter.rooms);
  console.log(socket.handshake.query);
  console.log("a user connected");
  socket.on("disconnect", function() {
    io.to(room).emit("speaker-disconnect");
  });
  socket.join(room);
  io.to(room).emit("speaker-connect", io.sockets.adapter.rooms[room].length);
  socket.on("talk", function(key) {
    io.to(room).emit("talk", key);
  });
});

http.listen(4000, function() {
  console.log("listening on *:4000");
});
