const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const usernames = {};

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
    socket.on('chat message', msg => {
        io.emit('chat message', socket.username, msg);
        io.sockets.emit('updatechat', socket.username, msg);
    });
    socket.on('disconnect', function(){
        console.info('disconnected');
    });
    socket.on('adduser', username => {
        socket.username = username;
        usernames[username] = username;
        socket.emit('updatechat', 'SERVER', 'you have connected');
        socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
        io.sockets.emit('updateusers', usernames);
    })
});

http.listen(port, function(){
    console.log('listening on *:' + port);
});