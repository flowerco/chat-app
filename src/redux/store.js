import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import screenReducer from './screenSlice';
import socketReducer from './socketSlice';
import chatReducer from './chatSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    screen: screenReducer,
    socket: socketReducer,
    chat: chatReducer,
  },
});