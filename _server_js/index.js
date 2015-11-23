var settings = require('./settings'),
    path = require('path'),
    express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var data = require('./data')

app.use(express.static(path.normalize(__dirname + settings.static_path)));
app.use('/data',data);


var scores = {
  red:0,
  blue:0,
  green:0,
  orange:0
}

io.sockets.on('connection', function (socket) {

    socket.on('subscribe', function(data) {
      console.log("joined: " + data.room)
      socket.join(data.room);
    })
    socket.on('unsubscribe', function(data) {
      console.log("left: " + data.room)
      socket.leave(data.room);
    })

    socket.on('buzzIn', function(data) {
      console.log("Buzz: "+data.team)
      io.to('GameParts').emit('buzzIn', data.team);
    })

    socket.on('getScores',function(){
      io.to('GameParts').emit('scoreUpdate', scores);
    })

});
http.listen(3000, function(){
  console.log('listening on *:3000');
});
