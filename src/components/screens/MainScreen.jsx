import ChatScreen from "./ChatScreen";
import Modal from "../Modal";
import Sidebar from "../navs/Sidebar";
import Sidenav from "../navs/Sidenav";
import { useSelector } from "react-redux";

export default function MainScreen() {

  const screenState = useSelector(state => state.screen);

  return (
    <div className="h-screen w-screen bg-green-200">
      {screenState.modalState !== 'NONE' && <Modal type={screenState.modalState} childForm={null}/>}
      <div className='flex w-full h-full bg-blue-500'>
        <Sidenav />
        {/* Two sidebars for a nice switching animation as one slides in and one slides out. */}
        <Sidebar number={1} />
        <Sidebar number={2} />
        <ChatScreen chat={screenState.currentChat}/>
      </div>
    </div>
  );
}