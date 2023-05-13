import { createSlice } from '@reduxjs/toolkit';
import { removeArrayItem } from '../lib/utils';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    currentUser: {},
  },
  reducers: {
    authLogin: (state, action) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload;
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
    },
    authDeleteChat: (state, action) => {
      const itemIndex = state.currentUser.chats.indexOf(action.payload);
      const newChatList = removeArrayItem(state.currentUser.chats, itemIndex);
      state.currentUser.contacts = newChatList;
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
} = authSlice.actions;

export default authSlice.reducer;
