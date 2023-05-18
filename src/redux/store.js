import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import screenReducer from './screenSlice';
import socketReducer from './socketSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    screen: screenReducer,
    socket: socketReducer,
  },
});