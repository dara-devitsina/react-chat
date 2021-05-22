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
		// create new room and set it to rooms collection
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
	socket.on('ROOM: JOIN', ({ roomId, userName }) => {
		// connect to a room with respective roomId
		socket.join(roomId);
		// save current user to 'users' in current room
		rooms.get(roomId).get('users').set(socket.id, userName);
		// get names of all users
		const users = [...rooms.get(roomId).get('users').values()];
		// send socket request to all users in current room (except for yourself) and show all users in current room
		socket.to(roomId).broadcast.emit('ROOM: JOINED', users);
	})

	socket.on('disconnected', () => {
		rooms.forEach((value, roomId) => {
			// check if user was deleted
			if(value.get('users'.delete(socket.id))) {
				const users = [...value.get(roomId).get('users').values()];
				// send socket request to all users in current room (except for yourself) and show all users in current room
				socket.to(roomId).broadcast.emit('ROOM: SET_USERS', users);
			}
		});
	})

	console.log('user connected', socket.id);
});


server.listen(9999, (err) => {
	if (err) {
		throw Error(err);
	}
	console.log('Сервер запущен');
})

