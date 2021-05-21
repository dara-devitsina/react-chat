import React from 'react';
import io from 'socket.io-client';


function App() {
  const connectSocket = () => {
    io('http://localhost:9999');
  };

  // return (
  //   <div className="wrapper">
  //     <button onClick={connectSocket}>CONNECT</button>
  //     </div>
  // );
  return (
  <div className="Wrapper">
    <div class="join-block">
      <input type="text" placeholder = "Room ID" value = "" />
      <input type="text" placeholder = "Your name" value = "" />
      <button class="btn btn-success">JOIN</button>
    </div>
    </div>
  )
}

export default App;