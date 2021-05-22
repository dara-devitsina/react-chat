import React from 'react';
// socket variable tranmits socket request from client to backend
import socket from './socket';
import axios from 'axios';

import reducer from './reducer.js';
import JoinBlock from './components/JoinBlock';
import Chat from './components/Chat';

  function App() {
    const [state, dispatch] = React.useReducer(reducer, {
      joined: false,
      roomId: null,
      userName: null,
      users: [],
      messages: [],
    });

    const onLogin = async (obj) => {
      // 
      dispatch({
        type: 'JOINED',
        payload: obj,
      });
      // send socket request to server and connect to room
      socket.emit('ROOM: JOIN', obj);
      // when connected to socket room, send http get request for users and messages in current room
      const { data } = await axios.get(`/rooms/${obj.roomid}`);
      dispatch({
        type: 'SET_DATA',
        payload: data,
      });
    };

    const setUsers = (users) => {
      dispatch({
        type: 'SET_USERS',
        payload: users,
      })
    }

    const addMessage =(message) => {
      dispatch({
        type: 'NEW_MESSAGE',
        payload: message
      })
    }

    // create new user once
    React.useEffect(() => {
      socket.on('ROOM: SET_USERS', setUsers);
      socket.on('ROOM: NEW_MESSAGE', addMessage);
    },[]);

    window.socket = socket;

    // if user joined, show Join block, else show Chat room 
    return (
      <div className="wrapper">
        {!state.joined ? (
          <JoinBlock onLogin={onLogin} />
        ) : (
          <Chat {...state} onAddMessage={addMessage} />
        )}
      </div>
    );
  };

export default App;