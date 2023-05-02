import './App.css';
import { createContext, useEffect, useState } from 'react';
import MainScreen from './components/screens/MainScreen';
import AuthScreen from './components/screens/AuthScreen';
import ClipLoader from 'react-spinners/ClipLoader';
import { verifyLogin } from './lib/api';

export const ScreenContext = createContext();

function App() {
  const [screenState, setScreenState] = useState({
    isAuthenticated: false,
    currentUser: {},
    currentChat: {
      _id: '6420a39af84077a288f95dc1',
      firstName: 'Testy',
      userImg:
        'https://res.cloudinary.com/doeffypwo/image/upload/v1664008834/freechat/bki1ed0kngh7dj6vd464.jpg',
    },
    modalState: 'NONE',
    sidebarState: 0,
    activeSidebar: 'NONE',
    sidebarType: ['NONE', 'NONE'],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On first load, fetch the current user if the cookie exists
    // 1. Verify the jwt - note we don't check for the cookie first, since the cookie is httpOnly and
    // can't be viewed by the front-end code.
    async function verify() {
      const user = await verifyLogin();
      // 2. If the jwt is verified, the user will be fetched.
      // Add this user to the app state and set authenticated to true
      if (user) {
        setScreenState((screenState) => ({
          ...screenState,
          isAuthenticated: true,
          currentUser: user,
        }));
        setLoading(false);
      } else {
        // 3. Otherwise, stop the loading spinner and the login page will show.
        setLoading(false);
      }
    }
    verify();
  }, []);

  return (
    <ScreenContext.Provider value={{ screenState, setScreenState }}>
      {/* TODO: We need a single background upon which renders either the loader, 
      the login component or the app screen. */}
      {loading ? (
        <ClipLoader />
      ) : screenState.isAuthenticated ? (
        <MainScreen />
      ) : (
        <AuthScreen />
      )}
    </ScreenContext.Provider>
  );
}

export default App;
