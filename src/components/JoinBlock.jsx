import React from 'react';
import axios from 'axios';


function JoinBlock({ onLogin }) {
	// state
	const [roomId, setRoomId] = React.useState('');
	const [userName, setUserName] = React.useState('');

	const onEnter = () => {
		if (!roomId || !userName) {
			return alert('Please enter your name and room ID');
		}
		axios.post('/rooms', {
			roomId,
			userName
		}).then(onLogin);
	};

	return (
			<div className="join-block">
				<input type="text"
				placeholder="Room ID"
				value = {roomId}
				onChange={e => setRoomId(e.target.value)}/>
				<input type="text"
				placeholder="Your name"
				value={userName}
				onChange={e => setUserName(e.target.value)}/>
				<button onClick={onEnter} className="btn btn-success">JOIN</button>
			</div>
	);
}

export default JoinBlock;