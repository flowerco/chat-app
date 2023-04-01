import './App.css';
import { createContext, useContext, useState } from 'react';
import MainScreen from './components/screens/MainScreen';
import AuthScreen from './components/screens/AuthScreen';

export const ScreenContext = createContext();

function App() {
  const [screenState, setScreenState] = useState({
    isAuthenticated: false,
    currentUser: {},
    modalState: false,
    sidebarState: 0,
    activeSidebar: 'NONE',
    sidebarType: [
      'NONE',
      'NONE'
    ]
  })

  return (
      <ScreenContext.Provider value={{ screenState, setScreenState }} >
        {screenState.isAuthenticated 
        ? <MainScreen /> 
        : <AuthScreen />}
      </ScreenContext.Provider>
  );
}

export default App;
