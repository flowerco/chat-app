import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.REACT_SOCKET_URL || 'http://localhost:3002';

export const socket = io(URL, {
  autoConnect: false
});