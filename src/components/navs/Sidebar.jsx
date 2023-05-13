import { useEffect, useState } from 'react';
import { BsPlusCircle } from 'react-icons/bs';
import { fetchContacts, fetchChats } from '../../lib/api';
import Settings from './Settings';
import SidebarList from './SidebarList';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../redux/screenSlice';

const sidebarTypes = {
  NONE: {
    bgColor: 'bg-yellow-500',
    text: 'Somethings gone wrong if you can see me...',
  },
  CHATS: {
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
    topNavText: '',
  },
};

export default function Sidebar({ number }) {

  const screenState = useSelector(state => state.screen);
  const dispatch = useDispatch();

  const showSidebar = screenState.sidebarState === number;
  const typeName = screenState.sidebarType[number - 1];
  const type = sidebarTypes[typeName];

  const authState = useSelector(state => state.auth);

  // Use a single generic list rather than defining both contact/chat lists.
  const [userList, setUserList] = useState([]);

  // The screenstate holds a list of contact or chat IDs, but we need to pull the additional data for them here.
  useEffect(() => {
    const fetchData = async (typeName) => {
      let listData = [];
      if (typeName === 'CONTACTS') {
        listData = await fetchContacts(authState.currentUser._id);
        // We need a unique key field to populate the list correctly,
        // but it will be different for contacts and chats:
        listData = listData.map((contact) => ({
          ...contact,
          unqKey: contact._id,
        }));
      } else if (typeName === 'CHATS') {
        const chatList = await fetchChats(authState.currentUser._id);
        // Chats include an ID and a userList, so combine the userLists and filter based on ID
        const listSet = chatList.reduce((agg, chat) => {
          const newUsers = chat.userList;
          newUsers.forEach((user) => {
            user.unqKey = chat._id;
            if (!agg.includes(user._id)) {
              agg.push(user);
            }
          });
          return agg;
        }, []);

        listData = Array.from(listSet);
      }

      return listData;
    };

    // If the user has been loaded into the auth state, then we are safe to call the fetch method for that user.
    if (authState.currentUser._id) {
      fetchData(typeName).then((data) => {
        // console.log('Data returned: ', data);
        setUserList(data);
      });
    }
  }, [authState.currentUser, typeName]);

  const handleAddClick = (event) => {
    dispatch(openModal(typeName));
  };

  return (
    <div
      className={`w-80 h-full fixed top-0 left-16
    flex flex-col justify-center items-center
    transition-transform duration-200 ease-linear
    ${type.bgColor}
    ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className='h-full w-full mb-14 flex flex-col'>
        {type.topNavText && (
          <SidebarTopNav
            topNavText={type.topNavText}
            clickCallback={handleAddClick}
          />
        )}
        {typeName === 'SETTINGS' ? (
          <Settings user={authState.currentUser} />
        ) : (
          <SidebarList userList={userList} typeName={typeName} />
        )}
      </div>
    </div>
  );
}

const SidebarTopNav = ({ topNavText, clickCallback }) => {
  return (
    <div className='w-full h-16 flex justify-end items-center bg-gray-900'>
      <span className='text-green-500 text-xl pr-4'>{topNavText}</span>
      <button onClick={clickCallback} className='text-green-500 pr-8'>
        <BsPlusCircle size='32' />
      </button>
    </div>
  );
};
