import io from 'socket.io-client';

// all requests will be proxied to localhost:9999
const socket = io();

export default socket;