import React from 'react';
import App from './App';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen, waitFor } from '@testing-library/react';
import { mockChats, mockContacts, mockUser } from './tests/mocks';

// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from './tests/test-utils';

const rootUrl = 'http://localhost:3002';

// We use msw to intercept the network request during the test,
// and return the response 'John Smith' after 150ms
// when receiving a get request to the `/api/user` endpoint
export const handlers = [
  rest.get(`${rootUrl}/verifyLogin`, (req, res, ctx) => {
    return res(ctx.json(mockUser));
  }),
  rest.post(`${rootUrl}/api/fetchChats`, (req, res, ctx) => {
    return res(ctx.json(mockChats));
  }),
  rest.post(`${rootUrl}/api/fetchContacts`, (req, res, ctx) => {
    return res(ctx.json(mockContacts));
  }),
  rest.get(`${rootUrl}/socket.io`, (req, res, ctx) => {
    return res(ctx.json('socket connected'));
  }),
];

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => {
  server.listen();
  global.setImmediate = jest.useRealTimers;
  let scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
});

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

describe('basic funtionality of the app', () => {
  test('renders the app after verification of the user', async () => {
    // Confirm the main container for the app renders
    renderWithProviders(<App />);
    expect(screen.getByTestId('app-screen')).toBeInTheDocument();

    // Should show a loading spinner prior to verification
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // Wait for verification, login, and any mocked fetching of data,
    // then check the required elements are rendered
    await waitFor(() => {
      expect(screen.getByText(/log\s*out/i)).toBeInTheDocument();
      // TODO: to properly wait for the Redux state to update, we could wait
      // until the list of contacts in the sidebar is equal to mockedContacts
    });
    expect(screen.getByText(/freechat/i)).toBeInTheDocument();
    expect(screen.getByText('Contacts')).toBeInTheDocument();
    expect(screen.getByText('Chats')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByTestId('message-input')).toBeInTheDocument();

    // Wait to allow Redux actions to dispatch after login verification
    // TODO: should mock these so they happen instantly.
    await new Promise((r) => setTimeout(r, 1000));
  });
});
