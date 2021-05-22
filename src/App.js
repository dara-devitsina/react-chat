import React from 'react';
// socket variable tranmits socket request from client to backend
import socket from './socket';

import reducer from './reducer.js';
import JoinBlock from './components/JoinBlock';

  function App() {
    const [state, dispatch] = React.useReducer(reducer, {
      joined: false,
      roomId: null,
      userName: null,
    });

    const onLogin = (obj) => {
      dispatch({
        type: 'JOINED',
        payload: obj,
      });
      // send socket request to server
      socket.emit('ROOM: JOIN', obj);
    }

    console.log(state)

    return (
      <div className="wrapper">
        <JoinBlock onLogin={onLogin}/>
      </div>
    );
  };

export default App;