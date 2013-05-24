var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var numberOfUsers = 0;

server.listen(process.env.PORT || 5000);
//server.listen(8080);

app.use("/", express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {
  numberOfUsers += 1;

  socket.on('msg', function (data) {
    io.sockets.emit('new', data);
  });

  socket.on('disconnect', function (){
  	numberOfUsers -= 1;
    io.sockets.emit('changeUserNo', numberOfUsers);
  });

    io.sockets.emit('changeUserNo', numberOfUsers);
});
