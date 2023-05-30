import { createSlice } from '@reduxjs/toolkit';
import { replaceAtArrayIndex } from '../lib/utils';

export const screenSlice = createSlice({
  name: 'screen',
  initialState: {
    modalState: 'NONE',
    sidebarState: 0,
    editMode: false,
    activeSidebar: 'NONE',
    sidebarType: ['NONE', 'NONE'],
  },
  reducers: {
    openModal: (state, action) => {
      // console.log('Opening modal with type: ', action.payload);
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
      state.editMode = false;
    },
    hideSidebar: (state) => {
      state.sidebarState = 0;
      state.activeSidebar = 'NONE';
      state.editMode = false;
    },
    setEditMode: (state, action) => {
      state.editMode = action.payload;
    }
  },
});

export const {
  openModal,
  closeModal,
  showSidebar,
  hideSidebar,
  setEditMode
} = screenSlice.actions;

export default screenSlice.reducer;
