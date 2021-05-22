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

// parse requests to json format
app.use(express.json());

// a 'database' to store rooms, users and messages
const rooms = new Map([

]);

app.get('/room ids', (req, res) => {
	res.json(rooms);
});

app.post('/rooms', (req, res) => {
	const {roomId, usserName} = req.body;
	if (!rooms.has(roomId)) {
		// set new room to rooms collection
		rooms.set(roomId, new Map([
			['users', new Map()],
			['messages', []],
		])
		);
	}
	res.send();
})

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

