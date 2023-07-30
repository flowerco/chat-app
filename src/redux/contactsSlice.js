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
        state.contacts = state.contacts.concat(action.payload);
      })
      .addCase(reduxFetchContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { loadContacts, reduxAddContact, reduxRemoveContact } =
  contactsSlice.actions;

export default contactsSlice.reducer;

// Asynchronous thunk to fetch the initial contacts data from the db.
// Note: we don't use a try/catch here since the error handling is done in the extra reducers.

export const reduxFetchContacts = createAsyncThunk(
  'contacts/loadContacts',
  async (userId) => {
    console.log('Redux fetching contacts for user: ', userId);
    const response = await fetchContacts(userId);
    console.log('Contacts found: ', response);
    return response;
  }
);
