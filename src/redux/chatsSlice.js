import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchChats } from '../lib/api';

// Note the chat messages are stored locally and only loaded into the local state of the
// messageList component. A chat in the Redux state has the following format.
// TODO: This is where Typescript would be awesome!
// type Chat = {
//   _id: ID,
//   userList: [ID],
// }

const initialState = {
  chats: [],
  status: 'idle',
  error: null,
};

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    reduxLoadChats: (state, action) => {
      const chatList = action.payload;
      state.chats = chatList;
    },
    reduxAddChat: (state, action) => {
      const newChat = action.payload;
      console.log('Adding new chat in redux: ', newChat);
      state.chats.push(newChat);
    },
    reduxRemoveChat: (state, action) => {
      const chatId = action.payload;
      const newChats = state.chats.filter((chat) => chat._id !== chatId);
      state.chats = newChats;
    },
  },
  // The following extra reducers allow the state to be set depending on the
  // current status of the thunk as it runs asynchronously.
  extraReducers(builder) {
    builder
      .addCase(reduxFetchChats.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(reduxFetchChats.fulfilled, (state, action) => {
        state.status = 'success';
        state.chats = action.payload;
      })
      .addCase(reduxFetchChats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { reduxLoadChats, reduxAddChat, reduxRemoveChat } =
  chatsSlice.actions;

export default chatsSlice.reducer;

// Asynchronous thunk to fetch the initial contacts data from the db.
// Note: we don't use a try/catch here since the error handling is done in the extra reducers.

export const reduxFetchChats = createAsyncThunk(
  'chats/loadChats',
  async (userId) => {
    const response = await fetchChats(userId);
    return response;
  }
);
