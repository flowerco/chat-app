import { useState } from 'react';
import { BsPlusCircle } from 'react-icons/bs';
import Settings from './Settings';
import SidebarList from './SidebarList';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../redux/screenSlice';

const sidebarTypes = {
  NONE: {
    bgColor: 'bg-yellow-500',
    topNavText: 'Somethings gone wrong if you can see me...',
  },
  CHATS: {
    bgColor: 'bg-teal-500',
    textColor: 'text-black',
    topNavText: 'New Chat',
  },
  CONTACTS: {
    bgColor: 'bg-orange-500',
    topNavText: 'Add Contact',
  },
  SETTINGS: {
    bgColor: 'bg-blue-700',
    textColor: 'text-white',
    topNavText: '',
  },
};

export default function Sidebar({ number }) {
  const screenState = useSelector((state) => state.screen);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Identify the type of sidebar to display based on the number in the screen state.
  const showSidebar = screenState.sidebarState === number;
  const typeName = screenState.sidebarType[number - 1];
  const type = sidebarTypes[typeName];


  const [isLoading, setIsLoading] = useState(false);


  const handleAddClick = (event) => {
    dispatch(openModal(typeName));
  };

  return (
    <div
      className={`z-20 w-[calc(100%-4rem)] sm:w-80 h-full fixed top-0 left-16
    flex flex-col justify-center items-center
    transition-transform duration-200 ease-linear
    ${type.bgColor} ${type.textColor}
    ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className='h-full w-full z-50 flex flex-col'>
        {type.topNavText && (
          <SidebarTopNav
            topNavText={type.topNavText}
            clickCallback={handleAddClick}
          />
        )}
        {typeName === 'SETTINGS' ? (
          <Settings user={authState.currentUser} />
        ) : (
          <SidebarList loading={isLoading} typeName={typeName} />
        )}
      </div>
    </div>
  );
}

const SidebarTopNav = ({ topNavText, clickCallback }) => {
  return (
    <div className='w-full h-[80px] flex justify-end items-center bg-gray-900'>
      <span className='text-accent text-xl pr-4'>{topNavText}</span>
      <button onClick={clickCallback} className='text-accent pr-8'>
        <BsPlusCircle size='32' />
      </button>
    </div>
  );
};
