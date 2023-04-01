export const fetcher = async ({ url, method, body, json = true }) => {
  const res = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    // Handle any errors
    throw new Error('Api error');
  }

  if (json) {
    const data = await res.json();
    return data;
  }
};

export const register = (user) => {
  return fetcher({
    url: 'http://localhost:3002/api/register',
    method: 'POST',
    body: user,
  });
};

export const login = async (user) => {
  try {
    const fetchedData = await fetcher({
      url: 'http://localhost:3002/api/login',
      method: 'POST',
      body: { email: user.email, password: user.password },
    });
    return fetchedData;
  } catch (error) {
    console.log(error);
  }
};

export const search = async (contactsArray, searchString) => {
  try {
    const fetchedUsers = await fetcher({
      url: 'http://localhost:3002/api/searchUsers',
      method: 'POST', 
      body: { contactsArray, searchString }
    });
    return fetchedUsers
  } catch (error) {
    console.log(error);
  }
}

export const addContact = async ( currentUserId, newContactId ) => {
  try {
    const addedContact = await fetcher({
      url: 'http://localhost:3002/api/addContact',
      method: 'POST',
      body: { currentUserId, newContactId }
    })
    return addedContact;
  } catch (error) {
    console.log(error);
  }
}

export const fetchContacts = async (userId) => {
  try {
    const contactList = await fetcher({
      url: 'http://localhost:3002/api/fetchContacts',
      method: 'POST',
      body: { userId }
    });
    return contactList;
  } catch (error) {
    console.log(error);
  }
}

