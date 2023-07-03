import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isEqual, remove } from 'lodash';
import { fetchContacts } from "../lib/api";

const initialState = {
  contacts: [],
  status:'idle',
  error: null
}

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    loadContacts: (state, action) => {
      const contactList = action.payload;
      state.contacts = contactList;
    },
    addContact: (state, action) => {
      const newContact = action.payload;
      state.push(newContact);
    },
    removeContact: (state, action) => {
      const contactToDelete = action.payload;
      state = remove(state, isEqual(contactToDelete));
    }
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
      })
  }
});

export const {
  loadContacts,
  addContact,
  removeContact
} = contactsSlice.actions;

export default contactsSlice.reducer;

// Asynchronous thunk to fetch the initial contacts data from the db.
// Note: we don't use a try/catch here since the error handling is done in the extra reducers.

export const reduxFetchContacts = createAsyncThunk('contacts/loadContacts', async (userId) => {
  console.log('Redux fetching contacts for user: ', userId);
  const response = await fetchContacts(userId);
  console.log('Contacts found: ', response);
  return response;
});