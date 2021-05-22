import React from 'react';
// socket variable tranmits socket request from client to backend
import socket from './socket';

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

    const onLogin = (obj) => {
      dispatch({
        type: 'JOINED',
        payload: obj,
      });
      // send socket request to server
      socket.emit('ROOM: JOIN', obj);
    };

    const setUsers = (users) => {
      dispatch({
        type: 'SET_USERS',
        payload: users,
      })
    }

    // create new user once
    React.useEffect(() => {
      socket.on('ROOM: JOINED', setUsers);
      socket.on('ROOM: SET_USERS', setUsers);
    },[])

    window.socket = socket;

    // if user joined, show Join block, else show Chat room 
    return (
      <div className="wrapper">{!state.joined ? <JoinBlock onLogin={onLogin} /> : <Chat {...state} />}
      </div>
    );
  };

export default App;