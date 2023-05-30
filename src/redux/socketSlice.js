import { createSlice } from "@reduxjs/toolkit";

export const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    isConnected: false,
    contactConnected: false,
    typing: false,
    events: []
  },
  reducers: {
    socketSetConnected: (state, action) => {
      // console.log('Updating the socket state in redux to isConnected = ', action.payload);
      state.isConnected = action.payload;
    },
    socketSetContactConnected: (state, action) => {
      // console.log(`Contact has ${action.payload ? 'joined' : 'left'}, connected state = ${action.payload}`);
      state.contactConnected = action.payload;
    }
  }
});

export const {
  socketSetConnected,
  socketSetContactConnected,
} = socketSlice.actions;

export default socketSlice.reducer;