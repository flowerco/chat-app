import { useContext } from 'react';
import { BsChatLeftTextFill } from 'react-icons/bs';
import { MdSettings, MdLogout } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';
import { ScreenContext } from '../App';

export default function Sidenav() {
  const { screenState, setScreenState } = useContext(ScreenContext);

  function replaceAt(array, index, value) {
    const ret = array.slice(0);
    ret[index] = value;
    return ret;
  }

  const handleClick = (event) => {
    let sidebarToShow;
    if (screenState.activeSidebar === event.currentTarget.name) {
      sidebarToShow = 0;
    } else {
      sidebarToShow = screenState.sidebarState === 1 ? 2 : 1;
    }

    setScreenState({
      ...screenState,
      sidebarState: sidebarToShow,
      activeSidebar: sidebarToShow === 0 ? 'NONE' : event.currentTarget.name,
      sidebarType: replaceAt(
        screenState.sidebarType,
        sidebarToShow - 1,
        event.currentTarget.name
      ),
    });
  };

  const logout = (event) => {
    setScreenState({
      ...screenState,
      isAuthenticated: false,
    });
  };

  return (
    <div
      className='fixed top-0 left-0 h-full w-16 m-0 z-30
    flex flex-col bg-primary text-secondary shadow-lg'
    >
      <SidenavIcon
        callback={handleClick}
        name='CHAT'
        icon={<BsChatLeftTextFill size='20' />}
        text='Chats'
      />
      <SidenavIcon
        callback={handleClick}
        name='CONTACTS'
        icon={<FaUserFriends size='24' />}
        text='Contacts'
      />
      <hr className='border border-gray-400 rounded-full mx-2 my-3' />
      <SidenavIcon
        callback={handleClick}
        name='SETTINGS'
        icon={<MdSettings size='32' />}
        text="Settings"
      />
      <SidenavIcon
        callback={logout}
        icon={<MdLogout size='32' />}
        text='Log Out'
      />
    </div>
  );
}

const SidenavIcon = ({ icon, name, callback, text = 'tooltip 💡' }) => {
  return (
    <button name={name} onClick={callback} className='sidenav-icon group'>
      {icon}
      <span className='sidenav-tooltip group-hover:scale-100'>{text}</span>
    </button>
  );
};
