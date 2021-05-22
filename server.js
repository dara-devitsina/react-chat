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

// parse json requests
app.use(express.json());
// parse string/array requests
app.use(express.urlencoded({ extended: true }));

// a 'database' to store rooms, users and messages
const rooms = new Map();

// when server receives get request to '/rooms', it returns obj with current users and messages
app.get('/rooms/:id', (req, res) => {
	const { id: roomId } = req.params;
	// if there's some users and messages (roomId is present in 'rooms') then send users and messages of current room to client, else send empty arrays for users and messages)
	const obj = rooms.has(roomId) ? {
		users: [...rooms.get(roomId).get('users').values()],
		messages: [...rooms.get(roomId).get('messages').values()]
	} : { users: [], messages: []}
	res.json(obj);
});

app.post('/rooms', (req, res) => {
	const {roomId} = req.body;
	if (!rooms.has(roomId)) {
		// create new room with its users and messages and set it to rooms collection
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
		// send socket request to all users in current room showing all users in current room
		socket.to(roomId).broadcast.emit('ROOM: SET_USERS', users);
	});

	socket.on('ROOM: NEW MESSAGE', ({ roomId, userName, text }) => {
		const obj = {
			userName,
			text
		};
		// add current messages to 'messages' in current room
		rooms.get(roomId).get('messages').push(obj);
		// send socket request to all users in current room (except for myself) showing new message in current room
		socket.to(roomId).broadcast.emit('ROOM: NEW MESSAGE', users);
	});

	socket.on('disconnect', () => {
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
	console.log('Server started');
})

