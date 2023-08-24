import store from '../redux/store';
import { io } from 'socket.io-client';
import { socketSetConnected } from '../redux/socketSlice';
import { chatAddMessage } from '../redux/authSlice';
import { updateContactOnlineStatus } from '../redux/contactsSlice';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.REACT_APP_HOSTNAME || 'http://localhost:3002';

export const socket = io(URL, {
  autoConnect: false,
});

function onConnect() {
  store.dispatch(socketSetConnected(true));
  // TODO: new redux action to add to onlineUsers list
  // Oops, no this shouldn't be here. This should be on ... userConnected maybe?
  // We need to get the onlineUsers list back from an emitted broadcast first, not immediately on connection.
  // store.dispatch()
}

function onDisconnect() {
  // TODO: do we need a socket slice at all? Online status is now managed in the contact
  // slice via emitted online status from each socket on creation.
  store.dispatch(socketSetConnected(false));
  // socket.emit('user-offline', userId)
}

function onJoinChat(chatId, name) {
  console.log(name, ' is joining chat ', chatId);
}

function onOnline(userId) {
  console.log(userId, ' is online');
  // TODO: add online status for each contact in the contacts list
  // Update it here for one user via a dispatch
  store.dispatch(updateContactOnlineStatus({ userId, online: true }));
}

function onOffline(userId) {
  console.log(userId, ' is offline');
  store.dispatch(updateContactOnlineStatus({ userId, online: false }));
}

function onLeaveChat(chatId, name) {
  console.log(name, ' is leaving chat ', chatId);
}

function onSendMessage(senderId, message) {
  store.dispatch(chatAddMessage(senderId, message));
}

function onUserConnected(name) {
  console.log(`${name} connected.`);
}

export function createSocketListeners() {
  socket.on('connect', onConnect);
  socket.on('disconnect', onDisconnect);
  socket.on('user-online', onOnline);
  socket.on('user-offline', onOffline);
  socket.on('join-chat', onJoinChat);
  socket.on('leave-chat', onLeaveChat);
  socket.on('send-message', onSendMessage);
  socket.on('user-connected', onUserConnected);
}

export function removeSocketListeners() {
  socket.off('connect', onConnect);
  socket.off('disconnect', onDisconnect);
  socket.off('user-online', onOnline);
  socket.off('user-offline', onOffline);
  socket.off('join-chat', onJoinChat);
  socket.off('leave-chat', onLeaveChat);
  socket.off('send-message', onSendMessage);
  socket.off('user-connected', onUserConnected);
}
