import { createSlice } from '@reduxjs/toolkit';
import { loadState } from '../lib/localStorage';
import { removeArrayItem } from '../lib/utils';

const emptyChat = {
  userList: [],
  bubbleList: []  
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    currentUser: {},
    currentChat: emptyChat
  },
  reducers: {
    authLogin: (state, action) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload;

      const chatId = action.payload.currentChat;
      // If the user we just loaded has a currentChat to show onscreen, then pull that chat from localStorage.
      if (chatId) {
        console.log('Loading the chat from localStorage');
        const savedChat = loadState(chatId);
        if (savedChat) {
          console.log('Adding saved to chat to currentChat state.');
          state.currentChat = savedChat;
        } else {
          console.log('No saved chat to use.')
        }
      }
    },
    authLogout: (state) => {
      state.isAuthenticated = false;
      state.currentUser = {};
    },
    // Reducers to update the authorised user
    authAddContact: (state, action) => {
      state.currentUser.contacts.push(action.payload);
    },
    authDeleteContact: (state, action) => {
      const itemIndex = state.currentUser.contacts.indexOf(action.payload);
      const newContactList = removeArrayItem(
        state.currentUser.contacts,
        itemIndex
      );
      state.currentUser.contacts = newContactList;
    },
    authAddChat: (state, action) => {
      state.currentUser.chats.push(action.payload);
      // This will rerender the screen to show the new chat that was just created.
      state.currentUser.currentChat = action.payload;
      state.currentChat = emptyChat;
    },
    authDeleteChat: (state, action) => {
      // const itemIndex = state.currentUser.chats.indexOf(action.payload);
      // const newChatList = removeArrayItem(state.currentUser.chats, itemIndex);
      state.currentUser.chats = state.currentUser.chats.filter(chatId => chatId !== action.payload);
      state.currentUser.currentChat = '';
      state.currentChat = emptyChat;
    },
    authUpdateCurrentChat: (state, action) => {
      // state.currentUser.currentChat = action.payload;
      console.log('Updating current chat state with: ', action.payload);
      state.currentUser.currentChat = action.payload;
    },
    authUpdateUserImage: (state, action) => {
      console.log('Updating user image to: ', action.payload);
      state.currentUser.userImg = action.payload;
    },
    chatInitialiseMessages: (state, action) => {
      const chat = action.payload;
      state.currentChat.userList = chat.userList;
      state.currentChat.bubbleList = chat.bubbleList;
    },
    chatAddMessage: (state, action) => {
      const { senderId, message } = action.payload;
      state.currentChat.bubbleList.push({
        _id: senderId,
        timeStamp: new Date(Date.now()).toISOString(),
        text: message,
      });
      // TODO: just realised there are 2 elements of this state, both called currentChat... the one in user should be changed to currentChatId!
    },
  },
});

export const {
  authLogin,
  authLogout,
  authAddChat,
  authAddContact,
  authDeleteChat,
  authDeleteContact,
  authUpdateCurrentChat,
  authUpdateUserImage,
  chatInitialiseMessages,
  chatAddMessage
} = authSlice.actions;

export default authSlice.reducer;
