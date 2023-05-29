import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './redux/store';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import { saveState } from './lib/localStorage';
import { debounce } from './lib/utils';

const root = ReactDOM.createRoot(document.getElementById('root'));

// TODO: There are 3 ways I can see to delete messages older than X days.
// 1. Every pull from localStorage includes a filter.
// 2. The initial app load reviews the message cache and deletes the old ones.
// 3. We filter the list when showing it on screen, so the state written back to localStorage loses the history.
// Only option 2 actually deletes messages after a certain time, the others just give the appearance but leave
// the store sat there, potentially unsecure.

// At the top level of the app, we need all chats in memory

// NOPE. That's pure bullshit. Don't want to be carrying around a full list of all chats in memory, that'll slow
// everything down and doesn't scale at all. So we need to pull separate chats from localStorage, 
// and either:
// 1. Pull the full list of chats and save any updates to one chat in particular; or
// 2. Save each chat under a separate key in localStorage (can't be more than 5MB total for the app,
// seems unlikely this would happen but maybe delete early messages if save fails due to size limit?)

// Needs to be 2 really. Can't keep pulling the full list or holding it in memory.

// store.subscribe(debounce(() => {
//   // Ah crap, authState isn't populated when the app loads... so how can I pull the chat ID and get the
//   // chat from storage? Do I need a thunk dependent on the auth population?
//   const chatId = store.getState().auth.currentChat;
//   const chatToSave = store.getState().chat;
//   if (chatId) {
//     console.log('Trying to save the following state to localStorage: ', chatToSave);
//     saveState(chatId, chatToSave);
//   }
// }, 1000));

root.render(
  // <React.StrictMode>
    <Provider store={store} >
      <App />
    </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
