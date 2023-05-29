import { AES, enc } from 'crypto-js';

export const loadState = ( chatId ) => {
  try {
    const encryptedState = localStorage.getItem(chatId);
    if (encryptedState === null) {
      return undefined;
    }
    console.log('State pulled from localStorage: ', encryptedState);
    const decryptedState = AES.decrypt(encryptedState, process.env.REACT_APP_MESSAGE_ENCRYPTION_KEY || 'test_secret_key').toString(enc.Utf8);
    console.log('Decrypted state: ', decryptedState);
    return JSON.parse(decryptedState);
  } catch {
    // The fallback is always to return undefined and let the Redux reducer load the state.
    return undefined
  }
}

export const saveState = (chatId, state) => {
  try {
    // When we receive the state, update the localStorage item for that chat.
    console.log('Saving the following state to localStorage: ', JSON.stringify(state));
    const encryptedState = AES.encrypt(JSON.stringify(state), process.env.REACT_APP_MESSAGE_ENCRYPTION_KEY || 'test_secret_key').toString();
    console.log('Saving the following serialised state to localStorage: ', encryptedState);
    localStorage.setItem(chatId, encryptedState);
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