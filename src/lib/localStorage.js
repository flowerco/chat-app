export const loadState = ( chatId ) => {
  try {
    const serialisedState = localStorage.getItem(chatId);
    if (serialisedState === null) {
      return undefined;
    }
    console.log('State pulled from localStorage: ', serialisedState);
    return JSON.parse(serialisedState);
  } catch {
    // The fallback is always to return undefined and let the Redux reducer load the state.
    return undefined
  }
}

export const saveState = (chatId, state) => {
  try {
    // When we receive the state, update the localStorage item for that chat.
    const serialisedState = JSON.stringify(state);
    console.log('Saving the following serialised state to localStorage: ', serialisedState);
    localStorage.setItem(chatId, serialisedState);
  } catch (err) {
    // Ignore write errors
  }
}

export const deleteState = (chatId) => {
  try {
    console.log(`Deleting chat ${chatId} from localStorage`);
    localStorage.removeItem(chatId);
  } catch (err) {
    console.log('Failed to delete chat');
  }
}