const express = require("express");
const socketIO = require("socket.io");
const app = express();
const server = app.listen(9000);
const io = socketIO(server);
const path = require("path");

app.set("view engine", 'html')
app.engine('html', require('hbs').__express)
app.set('views', './html')

var userRooms = {};
var name = '';


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/join', (req, res) => {

    res.render('join')
})

app.get('/create', (req, res) => {
    res.render('create')
})

io.on('connection', (socket) => {
    console.log("connection socket")
    socket.on("joinRoom", (code) => {
        console.log("joinRoom")
        userRooms[code] = {}
        console.log("userRooms", userRooms)
        socket.join(code, () => console.log(socket.rooms))
    })

    socket.on("joinExisting", (code) => {
        console.log("existing")
        console.log("userRooms", userRooms)
        console.log("code", code)
        if (code in userRooms){
            socket.join(code, () => console.log(socket.rooms))
        }
        console.log("all conns", io.sockets.adapter.rooms)
    })
})

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
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