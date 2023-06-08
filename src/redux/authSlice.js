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
      console.log('Running authLogin with payload: ', action.payload);
      // If the user we just loaded has a currentChat to show onscreen, then pull that chat from localStorage.
      if (chatId) {
        console.log('Searching localStorage for a chat with ID: ', chatId);
        const savedChat = loadState(chatId, action.payload.keepTime || 0);
        if (savedChat) {
          console.log('Saved chat loaded in the auth state: ', savedChat);
          state.currentChat = savedChat;
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
      const {currentUserId, contactId, chatId} = action.payload;
      state.currentUser.chats.push(chatId);
      // This will rerender the screen to show the new chat that was just created.
      state.currentUser.currentChat = chatId;
      state.currentChat = {
        userList: [currentUserId, contactId],
        bubbleList: []
      };
    },
    authDeleteChat: (state, action) => {
      state.currentUser.chats = state.currentUser.chats.filter(chatId => chatId !== action.payload);
      state.currentUser.currentChat = '';
      state.currentChat = emptyChat;
    },
    authUpdateCurrentChat: (state, action) => {
      // console.log('Updating current chat state with: ', action.payload);
      state.currentUser.currentChat = action.payload;
    },
    authUpdateUserImage: (state, action) => {
      console.log('Updating user image to: ', action.payload);
      state.currentUser.userImg = action.payload;
    },
    authUpdateKeepTime: (state, action) => {
      console.log(`Keep messages for ${action.payload} days`);
      state.currentUser.keepTime = action.payload;
    },
    authUpdateSearchable: (state, action) => {
      console.log(`Searchable by all users: ${action.payload}`);
      state.currentUser.isSearchable = action.payload;
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
  authUpdateKeepTime,
  authUpdateUserImage,
  authUpdateSearchable,
  chatInitialiseMessages,
  chatAddMessage
} = authSlice.actions;

export default authSlice.reducer;
