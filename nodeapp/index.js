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
//const secret = require("./secret")

app.set("view engine", 'html')
app.engine('html', require('hbs').__express)
app.set('views', './html')
app.use(express.static(__dirname + '/html'));

const userRooms = {};
const name = '';

let GIFURL = "https://media.giphy.com/media/{id}/giphy.gif"

let RANDOMWORDS = "https://random-word-api.herokuapp.com/word?key=T1IWGUGJ&number=2"

let GIFBOX = `<div class="item">
<img src="https://media.giphy.com/media/{id}/giphy.gif" alt="Los Angeles"  style="width:100%;height:25em;">
</div>`

const listOfQuestions = createQuestionList()

function createQuestionList() {
    return fs.readFileSync(path.join(__dirname, "questions.txt"), { encoding: 'utf-8' }).split('\n')
}

function getRandomQuestion(listOfQuestions) {
    return listOfQuestions[Math.floor(Math.random() * items.length)];
}

function apiBuilder(keywords) {

    let carouselBuilder = []

    superagent.get(RANDOMWORDS).end((err, res) => {
        if (err) { return console.log(err) }
        let key1 = res.body[0]
        let key2 = res.body[1]

        superagent.get(URL)
            .query({ api_key: secret.giphyKey(), q: key1, limit: 40 })
            .end((err, res) => {
                if (err) { return console.log(err); }
                console.log(res.body.url);
                console.log(res.body.explanation);
                for (obj in res.body.data) {
                    carouselBuilder.add(GIFBOX.formatUnicorn(obj.id))
                }
            });

        superagent.get(URL)
            .query({ api_key: secret.giphyKey(), q: key2, limit: 40 })
            .end((err, res) => {
                if (err) { return console.log(err); }
                console.log(res.body.url);
                console.log(res.body.explanation);
                for (obj in res.body.data) {
                    carouselBuilder.add(GIFBOX.formatUnicorn(obj.id))
                }
            });

    })
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


app.get('/sharecode', (req, res) => {
    res.render('sharecode')
})
app.get('/load_all', (req, res) => {

    let carouselBuilder = []

    superagent.get(RANDOMWORDS).end((err, res) => {
        if (err) { return console.log(err) }
        let key1 = res.body[0]
        let key2 = res.body[1]

        superagent.get(URL)
            .query({ api_key: secret.giphyKey(), q: key1, limit: 40 })
            .end((err, res) => {
                if (err) { return console.log(err); }
                console.log(res.body.url);
                console.log(res.body.explanation);
                for (obj in res.body.data){
                    carouselBuilder.add(GIFBOX.formatUnicorn(obj.id))
                }
            });

        superagent.get(URL)
            .query({ api_key: secret.giphyKey(), q: key2, limit: 40 })
            .end((err, res) => {
                if (err) { return console.log(err); }
                console.log(res.body.url);
                console.log(res.body.explanation);
                for (obj in res.body.data){
                    carouselBuilder.add(GIFBOX.formatUnicorn(obj.id))
                }
                res.render('load_all', carousel=carouselBuilder)
            });

    })

})
app.get('/vote_all', (req, res) =>{
    res.render('vote_all')
})

app.get('/waiting', (req, res) => {
    res.render('waiting')
})
app.get('/waitingselection', (req,res)=>{
    res.render('waitingselection')
})

app.get('/waitingvote', (req,res)=>{
    res.render('waitingvote')
})

app.get('/winnerround', (req,res)=>{

    res.render("winnerround")
})

app.get('/winner',(req,res)=>{
    res.render("winner")
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
        if (code in userRooms) {
            console.log("existing")
            socket.join(code, () => console.log("rooms after joinExist", socket.rooms))
            if ("connected" in userRooms[code]) {
                userRooms[code]["connected"].add(socket.id)
            }
            else {
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
