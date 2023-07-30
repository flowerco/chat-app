import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { setupStore } from '../redux/store';

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// socket.io-client.js
let EVENTS = {};
function emit(event, ...args) {
  EVENTS[event].forEach((func) => func(...args));
}
const socket = {
  on(event, func) {
    if (EVENTS[event]) {
      return EVENTS[event].push(func);
    }
    EVENTS[event] = [func];
  },
  emit,
};
export const io = {
  connect() {
    return socket;
  },
};
// Additional helpers, not included in the real socket.io-client,just for out test.
// to emulate server emit.
export const serverSocket = { emit };

// cleanup helper
export function cleanup() {
  EVENTS = {};
}
export default io;
