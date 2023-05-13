import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import screenReducer from './screenSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    screen: screenReducer,
  },
})