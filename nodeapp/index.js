const express = require("express");
const socketIO = require("socket.io");
const app = express();
const server = app.listen(9000);
const io = socketIO(server);
const path = require("path");

var user_rooms = [];
var name = '';

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/html/home.html"))
})

app.get('/join', (req, res) => {
    res.sendFile(path.join(__dirname, "/html/join.html"))
})

app.get('/create', (req, res) => {
    var code = makeid(8);
    res.sendFile(path.join(__dirname, "/html/create.html"))
})

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// app.get('/:name', function(req, res){
//     name = req.params.name;
//     res.sendFile(path.join(__dirname, "/index.html"));
// });

// // socket
// io.sockets.on("connection", function(socket){
//     users[socket.id] = name;
//     // node
//     socket.on("nRoom", function(room){
//         socket.join(room);
//         socket.broadcast.in(room).emit("node new user", users[socket.id] + " new user has joined");
//     });

//     socket.on("node new message", function(data){
//         io.sockets.in("nRoom").emit('node news', users[socket.id] + ": "+ data);
//     });

//     // python
//     socket.on("pRoom", function(room){
//         socket.join(room);
//         socket.broadcast.in(room).emit("python new user", users[socket.id] + " new user has joined");
//     });

//     socket.on("python new message", function(data){
//         io.sockets.in("pRoom").emit('python news', users[socket.id] + ": "+ data);
//     });
// });