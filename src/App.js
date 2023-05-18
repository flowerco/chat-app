import './App.css';
import { createContext, useEffect, useState } from 'react';
import MainScreen from './components/screens/MainScreen';
import AuthScreen from './components/screens/AuthScreen';
import ClipLoader from 'react-spinners/ClipLoader';
import { verifyLogin } from './lib/api';
import { socket } from './lib/socket';
import { useDispatch, useSelector } from 'react-redux';
import { authLogin, authLogout } from './redux/authSlice';
import { socketAddEvent, socketSetConnected } from './redux/socketSlice';

export const ScreenContext = createContext();

function App() {

  const authState = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    function onConnect() {
      console.log('Calling the onConnect function from the socket listener');
      dispatch(socketSetConnected(true));
    }

    function onDisconnect() {
      dispatch(socketSetConnected(false));
    }

    function onJoinChat(chatId, name) {
      console.log(name,' is joining chat ',chatId);
    }

    function onSendMessage(value) {
      dispatch(socketAddEvent(value));
    }

    function onUserConnected(name) {
      console.log(`${name} connected.`);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('join-chat', onJoinChat);
    socket.on('send-message', onSendMessage);
    socket.on('user-connected', onUserConnected);
    
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('join-chat', onJoinChat)
      socket.off('send-message', onSendMessage);
      socket.off('user-connected', onUserConnected);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    // On first load, fetch the current user if the cookie exists
    // 1. Verify the jwt - note we don't check for the cookie first, since the cookie is httpOnly and
    // can't be viewed by the front-end code.
    async function verify() {
      const user = await verifyLogin();
      // 2. If the jwt is verified, the user will be fetched.
      // Add this user to the app state and set authenticated to true
      if (user) {
        dispatch(authLogin(user));
        setLoading(false);
      } else {
        // 3. Otherwise, stop the loading spinner and the login page will show.
        dispatch(authLogout);
        setLoading(false);
      }
    }
    verify();
  }, []);

  return (
    <div className='h-full w-full'>
      {/* TODO: We need a single background upon which renders either the loader, 
      the login component or the app screen. */}
      {loading ? (
        <ClipLoader />
      ) : authState.isAuthenticated ? (
        <MainScreen />
      ) : (
        <AuthScreen />
      )}
    </div>
  );
}

export default App;
