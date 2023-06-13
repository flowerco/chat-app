import './App.css';
import { createContext, useEffect, useState } from 'react';
import MainScreen from './components/screens/MainScreen';
import AuthScreen from './components/screens/AuthScreen';
import ClipLoader from 'react-spinners/ClipLoader';
import { verifyLogin } from './lib/api';
import { createSocketListeners, removeSocketListeners } from './lib/socket';
import { useDispatch, useSelector } from 'react-redux';
import { authLogin, authLogout } from './redux/authSlice';

export const ScreenContext = createContext();

function App() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  // Set up event listeners for the socket.io connection at App level.
  useEffect(() => {
    createSocketListeners();
    // Cleanup callback to remove the listeners between complete re-renders of the App.
    return () => {
      removeSocketListeners();
    };
  }, []);

  useEffect(() => {
    // On first load, fetch the current user if the cookie exists
    // 1. Verify the jwt - note we don't check for the cookie first, since the cookie is httpOnly and
    // can't be viewed by the front-end code.
    async function verify() {
      // TODO: Need a timeout here in case the api can't connect to the server.
      // Otherwise we get stuck loading.
      const user = await verifyLogin();
      // 2. If the jwt is verified, the user will be fetched.
      // Add this user to the app state and set authenticated to true
      if (user) {
        console.log('User sent back from verifying login: ', user);
        dispatch(authLogin(user));
        setLoading(false);
      } else {
        // 3. Otherwise, stop the loading spinner and the login page will show.
        dispatch(authLogout);
        setLoading(false);
      }
    }
    // setTimeout(() => verify(), 2000);
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const override = {
    border: '8px solid'
  };

  return (
    <div className='h-screen w-full'>
      {/* TODO: We need a single background upon which renders either the loader, 
      the login component or the app screen. */}
      {loading ? (
        <div className='h-full w-full flex justify-center items-center bg-teal-500'>
          <ClipLoader size={120} color={'#5865f2'} cssOverride={override}/>
        </div>
      ) : authState.isAuthenticated ? (
        <MainScreen />
      ) : (
        <AuthScreen />
      )}
    </div>
  );
}

export default App;
