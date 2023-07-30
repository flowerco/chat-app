import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEditMode } from '../../redux/screenSlice';
import SearchBar from '../SearchBar';
import { ClipLoader } from 'react-spinners';
import ContactsList from '../ContactsList';
import ChatList from '../ChatList';

export default function SidebarList({ loading, typeName }) {
  const screenState = useSelector((state) => state.screen);
  const dispatch = useDispatch();

  // To know whether to display an 'Edit' button, we need to know if
  // there is anything in the list
  const listState = useSelector((state) =>
    typeName === 'CONTACTS' ? state.contacts.contacts : state.chats.chats
  );

  const [searchString, setSearchString] = useState('');

  const toggleEdit = () => {
    dispatch(setEditMode(!screenState.editMode));
  };

  const handleSearch = (string) => {
    setSearchString(string.toLowerCase());
  };

  return (
    <div className='h-full w-full flex flex-col'>
      <SearchBar type={typeName} callback={handleSearch} />
      {/* TODO: How to check loading if the state is picked up from Redux?
      Can we access the status of the thunk that fetches the data? */}
      {loading ? (
        <ClipLoader size={32} color={'rgb(250 204 21)'} className='mx-auto' />
      ) : (
        <div className='w-full'>
          {typeName === 'CONTACTS' ? (
            <ContactsList searchString={searchString} />
          ) : (
            <ChatList searchString={searchString} />
          )}
        </div>
      )}
      {!loading && (
        <div className='flex justify-end p-4'>
          {
            // TODO: Need to hide the edit button when there are no chats/contacts,
            // but that will require access to both states...
            // Should the button be added to the chatList and contactList instead?
          }
          {listState.length > 0 && (
            <button
              onClick={toggleEdit}
              className={`rounded-md py-2 px-8 font-bold text-white ${
                screenState.editMode ? 'bg-green-600' : 'bg-blue-600'
              }`}
            >
              {screenState.editMode ? 'Done' : 'Edit'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
