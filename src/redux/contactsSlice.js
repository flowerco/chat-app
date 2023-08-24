import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchContacts } from '../lib/api';

const initialState = {
  contacts: [],
  status: 'idle',
  error: null,
};

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    reduxAddContact: (state, action) => {
      const newContact = action.payload;
      console.log('New contact to add to the state:', newContact);
      state.contacts.push(newContact);
    },
    reduxRemoveContact: (state, action) => {
      const contactToDelete = action.payload;
      console.log('Contact to delete from the state:', contactToDelete);
      const newState = state.contacts.filter(
        (contact) => contact._id !== contactToDelete._id
      );
      state.contacts = newState;
    },
    updateContactOnlineStatus: (state, action) => {
      console.log('Payload received: ', action.payload);
      const contactToUpdate = action.payload.userId;
      const onlineStatus = action.payload.online;
      console.log('Action received: ', contactToUpdate, onlineStatus);
      // TODO: the contact to update could be more easily accessed if it were stored as:
      // {'contactId': {name: 'jim', img: '.../.jpg'}}
      // Currently order n is proportional to length of contact list.
      for (let i = 0; i < state.contacts.length; i++) {
        if (state.contacts[i]._id === contactToUpdate) {
          state.contacts[i].online = onlineStatus;
        }
      }
    },
  },
  // The following extra reducers allow the state to be set depending on the
  // current status of the thunk as it runs asynchronously.
  extraReducers(builder) {
    builder
      .addCase(reduxFetchContacts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(reduxFetchContacts.fulfilled, (state, action) => {
        state.status = 'success';
        state.contacts = action.payload;
      })
      .addCase(reduxFetchContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {
  loadContacts,
  reduxAddContact,
  reduxRemoveContact,
  updateContactOnlineStatus,
} = contactsSlice.actions;

export default contactsSlice.reducer;

// Asynchronous thunk to fetch the initial contacts data from the db.
// Note: we don't use a try/catch here since the error handling is done in the extra reducers.

export const reduxFetchContacts = createAsyncThunk(
  'contacts/loadContacts',
  async (userId) => {
    // console.log('Redux fetching contacts for user: ', userId);
    const response = await fetchContacts(userId);
    // console.log('Contacts found: ', response);
    return response;
  }
);
