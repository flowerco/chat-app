import { useContext } from "react";
import { ScreenContext } from "../../App";
import ChatScreen from "./ChatScreen";
import Modal from "../Modal";
import Sidebar from "../navs/Sidebar";
import Sidenav from "../navs/Sidenav";

export default function MainScreen() {

  const { screenState } = useContext(ScreenContext);

  return (
    <div className="h-screen w-screen bg-green-200">
      {screenState.modalState && <Modal childForm={null}/>}
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