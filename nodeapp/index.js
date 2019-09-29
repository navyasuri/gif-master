const express = require("express");
const socketIO = require("socket.io");
const app = express();
const server = app.listen(8080);
const io = socketIO(server);
const path = require("path");
const fs = require('fs')
const superagent = require('superagent')
const URL = "https://api.giphy.com/v1/gifs/search"
const formatUnicorn = require('format-unicorn')

app.set("view engine", 'html')
app.engine('html', require('hbs').__express)
app.set('views', './html')
app.use(express.static(__dirname + '/html'));

const userRooms = {};
const name = '';

let GIFURL = "https://media.giphy.com/media/{id}/giphy.gif"

let GIFBOX = `<div class="item active">
<img src="https://media.giphy.com/media/{id}/giphy.gif" alt="Los Angeles"  style="width:100%;height:25em;">
</div>`

const listOfQuestions = createQuestionList()

function createQuestionList() {
    return fs.readFileSync(path.join(__dirname, "questions.txt"), { encoding: 'utf-8' }).split('\n')
}

function getRandomQuestion(listOfQuestions) {
    return listOfQuestions[Math.floor(Math.random() * items.length)];
}

async function apiBuilder(keywords) {
    if (keywords.length == 1) {
        keywords.add("None")
    }

    let carouselBuilder = []

    superagent.get(URL)
        .query({ api_key: 'DEMO_KEY', q: keywords[0], limit: 40 })
        .end((err, res) => {
            if (err) { return console.log(err); }
            console.log(res.body.url);
            console.log(res.body.explanation);
            carouselBuilder.add(res.body.explanation.data.embed_url)
        });

    superagent.get(URL)
        .query({ api_key: 'DEMO_KEY', q: keywords[1], limit: 40 })
        .end((err, res) => {
            if (err) { return console.log(err); }
            console.log(res.body.url);
            console.log(res.body.explanation);
            carouselBuilder.add(res.body.explanation.data.embed_url)
        });

    return carouselBuilder;

}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/join', (req, res) => {

    res.render('join')
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.get('/sharecode', (req, res) =>{
    res.render('sharecode')
app.get('/load_all', (req, res) => {
    res.render('load_all')
})

app.get('/waiting', (req, res) => {
    res.render('waiting')
})

io.on('connection', (socket) => {

    console.log("connection socket")

    socket.on("joinRoom", (code) => {
        console.log("joinRoom")
        userRooms[code] = {}
        console.log("userRooms", userRooms)
        socket.join(code, () => console.log("new user", socket.rooms))
    })

    socket.on("joinExisting", (code) => {
        console.log("userRooms", userRooms)
        console.log("code", code)
        if (code in userRooms){
            console.log("existing")
            socket.join(code, () => console.log("rooms after joinExist", socket.rooms))
            if ("connected" in userRooms[code]){
                userRooms[code]["connected"].add(socket.id)
            }
            else{
                userRooms[code]["connected"] = [socket.id]
            }
            
        }
        console.log("all conns", io.sockets.adapter.rooms)
    })

    socket.on("startGame", (code) => {
        console.log("starting game", code)
        console.log(socket.rooms)
        // io.in(code).emit("startClientGame")
        io.emit('startClientGame')
        // io.emit('an event sent to all connected clients');
        // socket.to(code).emit("startClientGame")
    })
})
})