import { useContext, useEffect, useState } from 'react';
import { ScreenContext } from '../../App';
import { BsPlusCircle } from 'react-icons/bs';
import SearchBar from '../SearchBar';
import { addContact, fetchContacts } from '../../lib/api';
import UserList from '../UserList';

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
    topNavText: '',
  },
};

export default function Sidebar({ number }) {
  const { screenState, setScreenState } = useContext(ScreenContext);
  const showSidebar = screenState.sidebarState === number;
  const typeName = screenState.sidebarType[number - 1];
  const type = sidebarTypes[typeName];

  const [contacts, setContacts] = useState([]);
  const [edit, setEdit] = useState(false);
  const toggleEdit = () => {
    setEdit(!edit);
  };

  useEffect(() => {
    // Using the list of contacts, we need to fetch the full data so they can be displayed
    const fetchData = async () => {
      return await fetchContacts(screenState.currentUser._id);
    };
    fetchData().then((data) => {
      setContacts(data);
    });
  }, [screenState.currentUser]);

  const handleAddClick = (event) => {
    setScreenState({
      ...screenState,
      modalState: true,
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
        <div className='w-full flex-grow'>
          {contacts.length > 0 ? (
            <UserList users={contacts} edit={edit} />
          ) : (
            `No ${type} here yet, let's add some!`
          )}
        </div>
        <div className='flex justify-end p-4'>
          <button
            onClick={toggleEdit}
            className={`rounded-md py-2 px-8 font-bold text-white ${edit ? 'bg-green-600' : 'bg-blue-600'}`}
          >
            {edit ? 'Done' : 'Edit'}
          </button>
        </div>
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
