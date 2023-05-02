import { useContext, useEffect, useState } from 'react';
import { ScreenContext } from '../../App';
import { BsPlusCircle } from 'react-icons/bs';
import SearchBar from '../SearchBar';
import { fetchContacts, fetchChats } from '../../lib/api';
import UserList from '../UserList';
import Settings from './Settings';

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
  const { screenState, setScreenState } = useContext(ScreenContext);
  const showSidebar = screenState.sidebarState === number;
  const typeName = screenState.sidebarType[number - 1];
  const type = sidebarTypes[typeName];

  // Use a single generic list rather than defining both contact/chat lists.
  const [userList, setUserList] = useState([]);
  const [edit, setEdit] = useState(false);
  const toggleEdit = () => {
    setEdit(!edit);
  };

  // The screenstate holds a list of contact IDs, but we need to pull the additional data for them here.
  useEffect(() => {
    // Using the list of contacts, we need to fetch the full data so they can be displayed
    // console.log('Fetching the list of contacts for user', screenState.currentUser);

    const fetchData = async (typeName) => {
      let listData = [];
      if (typeName === 'CONTACTS') {
        listData = await fetchContacts(screenState.currentUser._id);
        // We need a unique key field to populate the list correctly,
        // but it will be different for contacts and chats:
        listData = listData.map((contact) => ({
          ...contact,
          unqKey: contact._id,
        }));
        console.log(
          `Contacts fetched for user ${screenState.currentUser._id}: `,
          listData
        );
      } else if (typeName === 'CHATS') {
        const chatList = await fetchChats(screenState.currentUser._id);
        console.log(
          `Chats fetched for user ${screenState.currentUser._id}: `,
          chatList
        );
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
        // If we're looking for chats then fetch the chat list and filter for contacts.

        // TODO: WAIT, IS THIS SILLY?
        // WHY NOT UPDATE THE CHAT FETCH TO POPULATE THE USERS????!!!!
        // THERE'S A REF TO THEM IN THE CHAT SCHEMA!!!
        // FLIPPIN NORA XD
        // listData = await fetchChats(screenState.currentUser._id);

        // const chatContacts = new Set (chatList.reduce((agg, chat) => [...agg, ...chat.userList], []));
        // console.log('List of all contacts currently chatting: ', chatContacts);

        // listData = listData.filter((item) => {
        //   console.log('ITEM: ', item);
        //   return chatContacts.has(item._id)
        // });
        // console.log('Final filtered chat list: ', listData);
      }

      return listData;
    };
    if (screenState.currentUser._id) {
      fetchData(typeName).then((data) => {
        console.log('Data returned: ', data);
        setUserList(data);
      });
    }
  }, [screenState.currentUser, typeName]);

  const handleAddClick = (event) => {
    setScreenState({
      ...screenState,
      modalState: typeName,
      sidebarState: 0,
      activeSidebar: 'NONE',
    });
  };

  const handleSearch = (searchString) => {};

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
            type={typeName}
            topNavText={type.topNavText}
            clickCallback={handleAddClick}
            searchCallback={handleSearch}
          />
        )}
        {typeName !== 'SETTINGS' && (
          <div className='h-full w-full flex flex-col'>
            <div className='w-full flex-grow'>
              {/* Contacts aren't being fetched, so the length is always zero, so nothing gets rendered... */}
              {userList.length > 0 ? (
                <UserList users={userList} edit={edit} type={typeName} />
              ) : (
                <p className='text-center'>
                  No {typeName.toLowerCase()} here yet, let's add some!
                </p>
              )}
            </div>
            <div className='flex justify-end p-4'>
              {userList.length > 0 && (
                <button
                  onClick={toggleEdit}
                  className={`rounded-md py-2 px-8 font-bold text-white ${
                    edit ? 'bg-green-600' : 'bg-blue-600'
                  }`}
                >
                  {edit ? 'Done' : 'Edit'}
                </button>
              )}
            </div>
          </div>
        )}
        {typeName === 'SETTINGS' && <Settings user={screenState.currentUser} />}
      </div>
    </div>
  );
}

const SidebarTopNav = ({ type, topNavText, clickCallback, searchCallback }) => {
  return (
    <>
      <div className='w-full h-30 flex flex-col justify-center items-center'>
        <div className='w-full h-16 flex justify-end items-center bg-gray-900'>
          <span className='text-green-500 text-xl pr-4'>{topNavText}</span>
          <button onClick={clickCallback} className='text-green-500 pr-8'>
            <BsPlusCircle size='32' />
          </button>
        </div>
        <SearchBar type={type} callback={searchCallback} />
      </div>
    </>
  );
};
