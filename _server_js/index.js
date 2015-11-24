var settings = require('./settings'),
    path = require('path'),
    express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var data = require('./data')

var scores = {
  red:0,
  blue:0,
  green:0,
  orange:0
}

app.use(express.static(path.normalize(__dirname + settings.static_path)));
app.use('/data',data);


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

    socket.on('updateScores',function(data){
      scores = data.scores;
      io.to('GameParts').emit('scoreUpdate', scores);
    })
    socket.on('clear',function(){
      io.to('GameParts').emit('clear');
    })
    socket.on('choseQuestion',function(data){
      io.to('Controller').emit('choseQuestion',data);
    })
    socket.on('giveQuestion',function(data){
      io.to('Board').emit('giveQuestion',data);
    })
    socket.on('restart',function(data){
      data = require('./data')
      scores = {
        red:0,
        blue:0,
        green:0,
        orange:0
      }

      io.emit('restart');
    })

});
http.listen(8080, function(){
  console.log('listening on *:8080');
});
