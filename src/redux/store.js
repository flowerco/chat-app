import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import screenReducer from './screenSlice';
import socketReducer from './socketSlice';
import contactsReducer from './contactsSlice';
import chatsReducer from './chatsSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    screen: screenReducer,
    socket: socketReducer,
    contacts: contactsReducer,
    chats: chatsReducer,
  },
});

export const setupStore = (preloadedState) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      screen: screenReducer,
      socket: socketReducer,
      contacts: contactsReducer,
      chats: chatsReducer,
    },
    preloadedState,
  });
};
