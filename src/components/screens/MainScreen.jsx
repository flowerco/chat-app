import ChatScreen from './ChatScreen';
import Modal from '../Modal';
import Sidebar from '../navs/Sidebar';
import Sidenav from '../navs/Sidenav';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { socket } from '../../lib/socket';

export default function MainScreen() {
  const authState = useSelector((state) => state.auth);
  const screenState = useSelector((state) => state.screen);

  useEffect(() => {
    socket.connect();
    socket.emit('user-online', authState.currentUser._id);
    return () => {
      socket.emit('user-offline', authState.currentUser._id);
      socket.disconnect();
    };
    // We don't want to reconnect every time the socket updates. Remove the dependency to only run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='h-screen w-screen bg-secondary'>
      {screenState.modalState !== 'NONE' && (
        <Modal type={screenState.modalState} childForm={null} />
      )}
      <div className='flex w-full h-full'>
        <Sidenav />
        {/* Two sidebars for a nice switching animation as each one slides in and one slides out. */}
        <Sidebar number={1} />
        <Sidebar number={2} />
        <ChatScreen />
      </div>
    </div>
  );
}
