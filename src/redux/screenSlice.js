import { createSlice } from '@reduxjs/toolkit';
import { replaceAtArrayIndex } from '../lib/utils';

export const screenSlice = createSlice({
  name: 'screen',
  initialState: {
    currentChat: {
      _id: '644f98214cb784ed82566245',
      firstName: 'testmore',
      userImg:
        'https://res.cloudinary.com/doeffypwo/image/upload/v1664008834/freechat/bki1ed0kngh7dj6vd464.jpg',
    },
    modalState: 'NONE',
    sidebarState: 0,
    activeSidebar: 'NONE',
    sidebarType: ['NONE', 'NONE'],
  },
  reducers: {
    openModal: (state, action) => {
      console.log('Opening modal with type: ', action.payload);
      state.modalState = action.payload;
      state.sidebarState = 0;
      state.activeSidebar = 'NONE';
    },
    closeModal: (state) => {
      state.modalState = 'NONE';
    },
    showSidebar: (state, action) => {
      const sidebarName = action.payload;
      let sidebarToShow;
      // There are only 2 sidebar components, so clicking will either close the current component
      // or show the first one not currently showing.
      if (state.activeSidebar === sidebarName) {
        sidebarToShow = 0;
      } else {
        sidebarToShow = state.sidebarState === 1 ? 2 : 1;
      }
      state.sidebarState = sidebarToShow;
      state.activeSidebar = sidebarToShow === 0 ? 'NONE' : sidebarName;
      state.sidebarType = replaceAtArrayIndex(
        state.sidebarType,
        sidebarToShow - 1,
        sidebarName
      );
    },
    // Go to a new chat and hide the sidebar
    updateCurrentChat: (state, action) => {
      state.currentChat = { ...action.payload };
      state.sidebarState = 0;
      state.activeSidebar = 'NONE';
    },
    // Hide the current chat, eg. when the contact is deleted.
    removeCurrentChat: (state) => {
      state.currentChat = {};
    },
  },
});

export const {
  openModal,
  closeModal,
  showSidebar,
  updateCurrentChat,
  removeCurrentChat,
} = screenSlice.actions;

export default screenSlice.reducer;
