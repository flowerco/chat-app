import './App.css';
import { createContext, useContext, useState } from 'react';
import MainScreen from './components/screens/MainScreen';
import AuthScreen from './components/screens/AuthScreen';

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
    modalState: false,
    sidebarState: 0,
    activeSidebar: 'NONE',
    sidebarType: ['NONE', 'NONE'],
  });

  return (
    <ScreenContext.Provider value={{ screenState, setScreenState }}>
      {screenState.isAuthenticated ? <MainScreen /> : <AuthScreen />}
    </ScreenContext.Provider>
  );
}

export default App;
