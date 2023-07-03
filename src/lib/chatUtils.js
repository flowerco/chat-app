import {
  authDeleteContact,
  authUpdateCurrentChat,
  chatInitialiseMessages,
} from '../redux/authSlice';
import { reduxAddChat } from '../redux/chatsSlice';
import {
  addChat,
  deleteContact,
  fetchChatById,
  updateCurrentUserProperty,
} from './api';
import { loadState } from './localStorage';

export const deleteContactFromList = async (authState, contact, dispatch) => {
  // First check if the contact you're deleting is the one you're currently chatting with.
  let isCurrentChat = false;
  const chatData = await fetchChatById(
    authState.currentUser._id,
    authState.currentUser.currentChat
  );
  if (chatData) {
    isCurrentChat = chatData.userList[0]._id === contact._id;
  }

  // We need to make sure that components fetching contacts when the screenState changes will
  // find the updated contact list, so await the delete before updating the state.
  await deleteContact(authState.currentUser._id, contact._id);
  dispatch(authDeleteContact(contact._id));
  // TODO: when a contact is deleted we need a function to delete any chats with that contact in localStorage.
  if (isCurrentChat) {
    dispatch(authUpdateCurrentChat(''));
  }
};

export const loadExistingChat = async (
  authState,
  chatId,
  contact,
  dispatch
) => {
  // Set the current chat for the user to the input chat
  await updateCurrentUserProperty(
    authState.currentUser._id,
    'currentChat',
    chatId.toString()
  );

  // Set the redux currentChat state to the input chat
  dispatch(authUpdateCurrentChat(chatId));

  // Pull the selected chat from localstorage, and create it if it doesn't exist.
  const persistedChatState = loadState(chatId, authState.currentUser.keepTime);

  console.log('Chat state pulled from local storage: ', persistedChatState);

  const finalChatState = persistedChatState || {
    userList: [authState.currentUser._id, contact._id],
    bubbleList: [],
  };

  // Add this chat to the current user state in redux
  // We need a backup empty state to add here in case the cache has been deleted.
  dispatch(chatInitialiseMessages(finalChatState));
};

export const createNewChat = async (currentUserId, contact, dispatch) => {
  const newChatId = await addChat(currentUserId, contact._id);
  // When the state updates this will trigger a useEffect in the bubbleList to show the new chat.
  dispatch(authUpdateCurrentChat(newChatId));
  const newChat = {
    userList: [currentUserId, contact._id],
    bubbleList: [],
  };
  dispatch(chatInitialiseMessages(newChat));

  // Now the problem is that the redux chatSlice needs different info to the authSlice
  // Authslice uses the actual chat message info:
  // { userList: [],
  //   bubbleList: []
  // }
  // Chatslice requires user info to display in the sidebar:
  // { _id: '', userList: [{ 
  //   _id: '',
  //   firstName: '',
  //   lastName: '',
  //   userImg: ''
  // }] }
  // TODO: In retrospect, this is silly. Chatslice should have the actual chat content
  // chats and contacts should be properties of the currentUser in the authSlice.
  const chatToAdd = { _id: newChatId, userList: [contact] };
  console.log('Created new chat to add to redux: ', chatToAdd);
  dispatch(reduxAddChat(chatToAdd));
};
