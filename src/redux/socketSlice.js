import { createSlice } from "@reduxjs/toolkit";
import { socket } from "../lib/socket";

export const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    isConnected: false,
    typing: false,
    events: []
  },
  reducers: {
    socketSetConnected: (state, action) => {
      // console.log('Updating the socket state in redux to joined = ', action.payload);
      state.joined = action.payload;
    },
  }
});

export const {
  socketSetConnected,
  socketAddEvent
} = socketSlice.actions;

export default socketSlice.reducer;