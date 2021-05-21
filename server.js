const express = require('express');

const app = express();
const server = require('http').createServer(app);
// connect socket with server
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        credentials: true,
        transports: ['websocket']

    }
});


const rooms = new Map([

]);

app.get('/rooms', function(req, res){
	res.json(rooms);
});

// when user connects we get new variable socket that will store all user info
io.on('connection', (socket) => {
	console.log('user connected', socket.id);
});


server.listen(9999, (err) => {
	if (err) {
		throw Error(err);
	}
	console.log('Сервер запущен');
})

