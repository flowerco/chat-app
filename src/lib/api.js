import { authLogout } from '../redux/authSlice';
import store from '../redux/store';

export const fetcher = async ({ url, method, body, json = true }) => {
  const cookieFlag = !['/register', '/login'].includes(url);

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
    return data;
  }
};

export const register = (user) => {
  return fetcher({
    url: 'http://localhost:3002/register',
    method: 'POST',
    body: user,
  });
};

export const verifyLogin = async () => {
  try {
    const verifiedUser = await fetcher({
      url: 'http://localhost:3002/verifyLogin',
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
      url: 'http://localhost:3002/login',
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
    url: 'http://localhost:3002/logout',
    method: 'GET',
  });
};

export const search = async (contactsArray, searchString) => {
  try {
    const fetchedUsers = await fetcher({
      url: 'http://localhost:3002/api/searchUsers',
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
      url: 'http://localhost:3002/api/addContact',
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
      url: 'http://localhost:3002/api/deleteContact',
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
      url: 'http://localhost:3002/api/fetchContacts',
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
      url: 'http://localhost:3002/api/fetchChats',
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
      url: 'http://localhost:3002/api/addChat',
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
      url: 'http://localhost:3002/api/deleteChat',
      method: 'POST',
      body: { currentUserId, chatId },
    });
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
};

export const updateCurrentChat = async (currentUserId, chatId) => {
  try {
    const updatedCurrentChat = await fetcher({
      url: 'http://localhost:3002/api/updateCurrentChat',
      method: 'POST',
      body: { currentUserId, chatId },
    });
    return updatedCurrentChat;
  } catch (error) {
    console.log(error);
  }
}

export const updateCurrentUserImage = async (currentUserId, newImg) => {
  try {
    const updatedCurrentUserImage = await fetcher({
      url: 'http://localhost:3002/api/updateUserImage',
      method:'POST',
      body: {currentUserId, newImg}
    })
    return updatedCurrentUserImage;
  } catch (error) {
    console.log(error);
  }
}

export const fetchChatForContact = async (currentUserId, contactId) => {
  try {
    const contactChatId = await fetcher({
      url: 'http://localhost:3002/api/fetchChatForContact',
      method: 'POST',
      body: { currentUserId, contactId },
    });
    return contactChatId;
  } catch (error) {
    console.log(error);
  }
}

export const fetchChatById = async (userId, chatId) => {
  try {
    const chat = await fetcher({
      url: 'http://localhost:3002/api/fetchChatById',
      method: 'POST',
      body: { userId, chatId },
    });
    return chat;
  } catch (error) {
    console.log(error);
  }
}
