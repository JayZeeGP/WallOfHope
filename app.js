var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var numberOfUsers = 0;
var listOfPosts = new Array();
var priorities = new Array();
var maximumSizeOfList = 4;
var startingPriority = 5
var id = 0;

//Timer to change the priorities 
setInterval(changePriorities,10000);

server.listen(process.env.PORT || 5000);
//server.listen(8080);

app.use("/", express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {
  numberOfUsers += 1;

  socket.on('addLife', function (id) {
    console.log("Add life to "+id);
  });

  socket.on('takeLife', function (id) {
    console.log("Take life from "+id);
  });

  socket.on('msg', function (data) {
  	if(listOfPosts.length == maximumSizeOfList){
  		listOfPosts.pop();
      priorities.pop();
  	}
    data.id=id;
    id+=1;
  	listOfPosts.push(data);
    priorities.push(startingPriority);
    io.sockets.emit('new', data);
  });

  socket.on('disconnect', function (){
  	numberOfUsers -= 1;
    io.sockets.emit('changeUserNo', numberOfUsers);
  });

  for(i = 0; i < listOfPosts.length; i++){
  	socket.emit('new',listOfPosts[i]);
  }

  //Sends the number of users to the user 
  //that has just connected
  io.sockets.emit('changeUserNo', numberOfUsers);
});


function changePriorities(){
  console.log("Changing priorities - List of posts length="+listOfPosts.length);

  for(i = 0; i < listOfPosts.length; i++){
    priorities[i] -= 1;
    console.log("New priority of "+listOfPosts[i].msg+" is "+priorities[i]);
    if(priorities[i] <= 0){ //Delete post
      console.log("Delete: "+listOfPosts[i].msg);
      listOfPosts.splice(i,1);
      priorities.splice(i,1);
    }
  }
}