var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var connectedCount = 0;
var clients = [];
var socketList = [];
var socketInfo = {};
var mapOfSocketIdToSocket = {};


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});



io.on('connection', function (socket) {

    socket.on('connectionInitiation', function () {
        user = {};
        var address = socket.handshake.address;
        io.sockets.sockets['socketID'] = socket.id;
        socketInfo = {};
        socketInfo['userId'] = address.split(':')[3];
        socketInfo['connectTime'] = new Date();
        socketInfo['name'] = user.name;
        socketInfo['socketId'] = socket.id;
        socketList.push(socketInfo);
        socket.userId = address.split(':')[3];
        clients.push(user.userId);
        mapOfSocketIdToSocket[socket.id] = socket;
    });

    socket.on('messageFromClient', function (cMessageObj, callback) {
        for (var i = 0; i < socketList.length; i++) {
            var IDFrom;
            if (socketList[i]['socketId'] == socket.id) {
                IDFrom = socketList[i]['name'];
                mapOfSocketIdToSocket[socketList[i]['socketId']].emit('clientToClientMessage', { Message: cMessageObj['Message'], From: socketList[i]['name'] });
            }
            if (socketList[i]['name'] == cMessageObj['To']) { // if user is online
                mapOfSocketIdToSocket[socketList[i]['socketId']].emit('clientToClientMessage', { Message: cMessageObj['Message'], From: IDFrom });
            }
        }
    })

});


http.listen(3000, function () {
    console.log('listening on *:3000');
});
