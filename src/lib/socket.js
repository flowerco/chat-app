import store from '../redux/store';
import { io } from 'socket.io-client';
import { socketAddEvent, socketSetConnected } from '../redux/socketSlice';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.REACT_SOCKET_URL || 'http://localhost:3002';

export const socket = io(URL, {
  autoConnect: false
});

function onConnect() {
  console.log('Calling the onConnect function from the socket listener');
  store.dispatch(socketSetConnected(true));
}

function onDisconnect() {
  store.dispatch(socketSetConnected(false));
}

function onDisconnecting() {
  console.log('Leaving rooms...');
}

function onJoinChat(chatId, name) {
  console.log(name, ' is joining chat ', chatId);
}

function onLeaveChat(chatId, name) {
  console.log(name, ' is leaving chat ', chatId);
}

function onSendMessage(value) {
  // store.dispatch();
  console.log(`Message received: ${JSON.stringify(value)}`);
}

function onUserConnected(name) {
  console.log(`${name} connected.`);
}

export function createSocketListeners () {
  socket.on('connect', onConnect);
  socket.on('disconnecting', onDisconnecting);
  socket.on('disconnect', onDisconnect);
  socket.on('join-chat', onJoinChat);
  socket.on('leave-chat', onLeaveChat);
  socket.on('send-message', onSendMessage);
  socket.on('user-connected', onUserConnected);
}

export function removeSocketListeners() {
  socket.off('connect', onConnect);
  socket.off('disconnecting', onDisconnecting);
  socket.off('disconnect', onDisconnect);
  socket.off('join-chat', onJoinChat);
  socket.off('leave-chat', onLeaveChat);
  socket.off('send-message', onSendMessage);
  socket.off('user-connected', onUserConnected);
}
