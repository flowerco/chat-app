import { createSlice } from '@reduxjs/toolkit';

const emptyChat = {
  userList: [],
  bubbleList: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState: localStorage.getItem('freeChats') || emptyChat,
  reducers: {
    chatInitialiseMessages: (state, action) => {
      const chat = action.payload;
      state.userList = chat.userList;
      state.bubbleList = chat.bubbleList;
    },
    chatAddMessage: (state, action) => {
      const { senderId, message } = action.payload;
      state.bubbleList.push({
        _id: senderId,
        timeStamp: new Date(Date.now()).toISOString(),
        text: message,
      });
    },
  },
});

const { chatInitialiseMessages, chatAddMessage } = chatSlice.actions;

// export default chatSlice.reducer;
