import ChatScreen from "./ChatScreen";
import Modal from "../Modal";
import Sidebar from "../navs/Sidebar";
import Sidenav from "../navs/Sidenav";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { socket } from "../../lib/socket";

export default function MainScreen() {

  const screenState = useSelector(state => state.screen);
  const authState = useSelector(state => state.auth);

  useEffect(() => {
    socket.connect();
    return (() => socket.disconnect());
    // We don't want to reconnect every time the socket updates. Remove the dependency to only run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="h-screen w-screen bg-green-200">
      {screenState.modalState !== 'NONE' && <Modal type={screenState.modalState} childForm={null}/>}
      <div className='flex w-full h-full bg-blue-500'>
        <Sidenav />
        {/* Two sidebars for a nice switching animation as one slides in and one slides out. */}
        <Sidebar number={1} />
        <Sidebar number={2} />
{/* 
        TODO: Screenstate no longer has currentChat... this is now in the authState as a property of the user, but is just a chat ID...
        I guess we need to fetch the chat/user data (eg. firstName, image) for this ID as well somewhere, possibly after it's created. */}

        <ChatScreen chatId={authState.currentUser.currentChat}/>
      </div>
    </div>
  );
}