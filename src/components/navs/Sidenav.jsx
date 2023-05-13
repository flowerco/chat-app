import { BsChatLeftTextFill } from 'react-icons/bs';
import { MdSettings, MdLogout } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';
import { logout } from '../../lib/api';
import { useDispatch } from 'react-redux';
import { showSidebar } from '../../redux/screenSlice';
import { authLogout } from '../../redux/authSlice';

export default function Sidenav() {

  const dispatch = useDispatch();

  const handleClick = (event) => {
    dispatch(showSidebar(event.currentTarget.name));
  };

  const handleLogout = (event) => {
    logout();
    dispatch(authLogout());
  };

  return (
    <div
      className='fixed top-0 left-0 h-full w-16 m-0 z-30
    flex flex-col bg-primary text-secondary shadow-lg'
    >
      <SidenavIcon
        callback={handleClick}
        name='CHATS'
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
        callback={handleLogout}
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
