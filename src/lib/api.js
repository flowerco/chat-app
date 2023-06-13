import { authLogout } from '../redux/authSlice';
import store from '../redux/store';

const rootUrl = process.env.REACT_APP_HOSTNAME
  ? `${process.env.REACT_APP_HOSTNAME}`
  : 'http://localhost:3002';

export const fetcher = async ({ url, method, body, json = true }) => {
  const cookieFlag = !['/register', '/login'].includes(url);

  console.log(`Sending fetch request to ${url} with cookie flag ${cookieFlag}`);

  const res = await fetch(url, {
    method,
    body: JSON.stringify(body),
    credentials: cookieFlag ? 'include' : 'omit',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    console.log('Fetch request failed with status ', res.status);
    if ([401, 403].includes(res.status)) {
      // If any request is no longer authorised then the cookie has expired and
      // the user should be logged out.
      store.dispatch(authLogout());
    } else {
      // Handle any other errors
      throw new Error('Api error');
    }
  }

  if (json) {
    const data = await res.json();
    console.log('Data returned from fetch request: ', data);
    return data;
  }
};

export const register = (user) => {
  return fetcher({
    url: `${rootUrl}/register`,
    method: 'POST',
    body: user,
  });
};

export const verifyLogin = async () => {
  try {
    const verifiedUser = await fetcher({
      url: `${rootUrl}/verifyLogin`,
      method: 'GET',
    });
    return verifiedUser;
  } catch (error) {
    console.clear();
    console.log('Please Authenticate');
    // Return a failed login status
    return null;
  }
};

export const login = async (user) => {
  try {
    const fetchedData = await fetcher({
      url: `${rootUrl}/login`,
      method: 'POST',
      body: { email: user.email, password: user.password },
    });
    return fetchedData;
  } catch (error) {
    console.log(error);
  }
};

export const logout = () => {
  fetcher({
    url: `${rootUrl}/logout`,
    method: 'GET',
  });
};

export const search = async (contactsArray, searchString) => {
  try {
    const fetchedUsers = await fetcher({
      url: `${rootUrl}/api/searchUsers`,
      method: 'POST',
      body: { contactsArray, searchString },
    });
    return fetchedUsers;
  } catch (error) {
    console.log(error);
  }
};

export const addContact = async (currentUserId, newContactId) => {
  try {
    const addedContact = await fetcher({
      url: `${rootUrl}/api/addContact`,
      method: 'POST',
      body: { currentUserId, newContactId },
    });
    return addedContact;
  } catch (error) {
    console.log(error);
  }
};

export const deleteContact = async (currentUserId, contactId) => {
  try {
    const updatedUser = await fetcher({
      url: `${rootUrl}/api/deleteContact`,
      method: 'POST',
      body: { currentUserId, contactId },
    });
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
};

export const fetchContacts = async (userId) => {
  try {
    const contactList = await fetcher({
      url: `${rootUrl}/api/fetchContacts`,
      method: 'POST',
      body: { userId },
    });
    return contactList;
  } catch (error) {
    console.log(error);
  }
};

export const fetchChats = async (userId) => {
  try {
    const contactList = await fetcher({
      url: `${rootUrl}/api/fetchChats`,
      method: 'POST',
      body: { userId },
    });
    return contactList;
  } catch (error) {
    console.log(error);
  }
};

export const addChat = async (currentUserId, contactId) => {
  try {
    const addedChat = await fetcher({
      url: `${rootUrl}/api/addChat`,
      method: 'POST',
      body: { currentUserId, contactId },
    });
    return addedChat;
  } catch (error) {
    console.log(error);
  }
};

export const deleteChat = async (currentUserId, chatId) => {
  try {
    const updatedUser = await fetcher({
      url: `${rootUrl}/api/deleteChat`,
      method: 'POST',
      body: { currentUserId, chatId },
    });
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
};

export const updateCurrentUserProperty = async (
  currentUserId,
  propertyName,
  propertyValue
) => {
  try {
    const apiString = `${rootUrl}/api/updateUserProperty`;
    const updatedProperty = await fetcher({
      url: apiString,
      method: 'POST',
      body: { currentUserId, propertyName, propertyValue },
    });
    return updatedProperty;
  } catch (err) {
    console.log(err);
  }
};

export const fetchChatForContact = async (currentUserId, contactId) => {
  try {
    const contactChatId = await fetcher({
      url: `${rootUrl}/api/fetchChatForContact`,
      method: 'POST',
      body: { currentUserId, contactId },
    });
    return contactChatId;
  } catch (error) {
    console.log(error);
  }
};

export const fetchChatById = async (userId, chatId) => {
  try {
    const chat = await fetcher({
      url: `${rootUrl}/api/fetchChatById`,
      method: 'POST',
      body: { userId, chatId },
    });
    return chat;
  } catch (error) {
    console.log(error);
  }
};
