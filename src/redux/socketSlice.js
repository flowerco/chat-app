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
      console.log('Updating the socket state in redux to joined = ', action.payload);
      state.joined = action.payload;
    },
    socketAddEvent: (state, action) => {
      console.log('Adding event: ', action.payload);
      state.events.push(action.payload);
      console.log('Woohoo, new event! ', state.events);
    }
  }
});

export const {
  socketSetConnected,
  socketAddEvent
} = socketSlice.actions;

export default socketSlice.reducer;