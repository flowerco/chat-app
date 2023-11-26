import { AES, enc } from 'crypto-js';

function hasDaysPassed(dateString, numberOfDays) {
  const currentDate = new Date(); // Get the current date
  const givenDate = new Date(dateString); // Convert the given ISO string to a date object

  // Calculate the difference in milliseconds between the current date and the given date
  const differenceInMs = currentDate - givenDate;

  // Calculate the number of days from the difference in milliseconds
  const daysPassed = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  return daysPassed >= numberOfDays;
}

export const loadState = (chatId, keepDays) => {
  try {
    const encryptedState = localStorage.getItem(chatId);
    // console.log('Encrypted message list found: ', encryptedState);
    if (encryptedState === null) {
      return undefined;
    }
    const decryptedState = AES.decrypt(
      encryptedState,
      process.env.REACT_APP_MESSAGE_ENCRYPTION_KEY
    ).toString(enc.Utf8);
    const messageState = JSON.parse(decryptedState);

    // Apply a filter to remove any old messages.
    // console.log('Keep days: ', keepDays);
    messageState.bubbleList = messageState.bubbleList.filter(
      (bubble) => !hasDaysPassed(bubble.timeStamp, keepDays)
    );
    // console.log('Messages returned: ', messageState);
    return messageState;
  } catch {
    // The fallback is always to return undefined and let the Redux reducer load the state.
    return undefined;
  }
};

export const saveState = (chatId, state) => {
  try {
    // When we receive the state, update the localStorage item for that chat.
    const encryptedState = AES.encrypt(
      JSON.stringify(state),
      process.env.REACT_APP_MESSAGE_ENCRYPTION_KEY
    ).toString();
    localStorage.setItem(chatId, encryptedState);
  } catch (err) {
    // Ignore write errors
  }
};

export const deleteState = (chatId) => {
  try {
    localStorage.removeItem(chatId);
  } catch (err) {
    console.log('Failed to delete chat');
  }
};
