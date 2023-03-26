import { useContext } from 'react';
import { ScreenContext } from '../App';
import { BsPlusCircle } from 'react-icons/bs';

const sidebarTypes = {
  NONE: {
    bgColor: 'bg-yellow-500',
    text: 'Somethings gone wrong if you can see me...',
  },
  CHAT: {
    bgColor: 'bg-pink-500',
    text: "I'm a chat Sidebar",
    topNavText: 'New Chat',
  },
  CONTACTS: {
    bgColor: 'bg-orange-500',
    text: "I'm a contacts Sidebar",
    topNavText: 'Add Contact',
  },
  SETTINGS: {
    bgColor: 'bg-blue-500',
    text: "I'm a settings Sidebar",
    topNavText: ''
  },
};

export default function Sidebar({ number }) {
  const { screenState } = useContext(ScreenContext);
  const showSidebar = screenState.sidebarState === number;
  const type = sidebarTypes[screenState.sidebarType[number - 1]];

  return (
    <div
      className={`w-80 h-full fixed top-0 left-16
    flex justify-center items-center
    transition-transform duration-200 ease-linear
    ${type.bgColor}
    ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}
    >
      { type.topNavText && <SidebarTopNav topNavText={type.topNavText} />}
      {`${type.text}`}
    </div>
  );
}

const SidebarTopNav = ({ topNavText }) => {
  return (
    <div className='fixed top-0 left-0 w-full h-16 flex justify-end items-center bg-gray-900'>
      <span className='text-green-500 text-xl pr-4'>{topNavText}</span>
      <button className='text-green-500 pr-8'>
        <BsPlusCircle size='32' />
      </button>
    </div>
  );
};
