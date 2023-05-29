import { BsPlusCircle } from 'react-icons/bs';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { addChat, addContact, search } from '../lib/api';
import { FcSearch } from 'react-icons/fc';
import { debounce } from '../lib/utils';
import BlankProfile from '../assets/blank-profile.png';
import { useDispatch, useSelector } from 'react-redux';
import { authAddChat, authAddContact } from '../redux/authSlice';
import { closeModal } from '../redux/screenSlice';
import { saveState } from '../lib/localStorage';

export default function SearchableList({ listType }) {
  
  const [itemList, setItemList] = useState([]);
  const [searchString, setSearchString] = useState('');

  const authState = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleChange = async (event) => {
    setSearchString(event.target.value);
    const searchList = listType.toLowerCase();
    const searchResult = await search(
      [authState.currentUser._id, ...authState.currentUser[searchList]],
      event.target.value
    );
    if (event.target.value === '') {
      setItemList([]);
    } else {
      setItemList(searchResult);
    }
  };

  const handleClick = async (event) => {
    const currentUser = authState.currentUser;
    const newChatOrContactId = event.currentTarget.value;

    if (listType === 'CONTACTS') {
      await addContact(currentUser._id, newChatOrContactId);
      dispatch(authAddContact(newChatOrContactId));
    }
    if (listType === 'CHATS') {
      console.log(`Adding a chat between you (${currentUser._id}) and another user ${newChatOrContactId}`)   
      // 1. Add the chat ID to the database (just as an ID in the currentUser.chats list) 
      const newChatId = await addChat(currentUser._id, newChatOrContactId);
      console.log('New chat created: ', newChatId);
      // 2. Add the chat to the state, so that it's visible on screen.
      dispatch(authAddChat(newChatId));
      // 3. Save the new chat to localStorage, so the messages can persist locally between sessions.
      saveState( newChatId, { userList: [currentUser._id, newChatOrContactId], bubbleList: [] })
    }
    dispatch(closeModal());
  };

  return (
    <div className='w-full h-full mt-4 flex flex-col justify-center items-center'>
      <div className='w-full h-10 px-4 flex items-center'>
        <input
          autoFocus
          onChange={(event) => debounce(handleChange(event))}
          value={searchString}
          className='w-full h-full rounded-full pl-6'
          type='text'
          placeholder={`Search for ${listType.toLowerCase()}...`}
        />
        <button disabled type='submit' className='w-6 h-6 object-cover -ml-8'>
          <FaSearch size='20' />
        </button>
      </div>
      <div className='w-full grow mt-4 flex justify-center items-center'>
        {itemList.length > 0 ? (
          <ul className='h-full w-full overflow-scroll flex flex-col justify-start items-center px-6 gap-2'>
            {itemList.map((item) => {
              return (
                <UserItem key={item._id} user={item} callback={handleClick} />
              );
            })}
          </ul>
        ) : (
          <FcSearch size='150' />
        )}
      </div>
    </div>
  );
}

const UserItem = ({ user, callback }) => {
  return (
    <li className='w-full h-12 flex justify-between items-center bg-grey-200 '>
      <img
        className='h-full aspect-square object-cover rounded-full'
        src={user.img || BlankProfile}
        onError={(event) => event.target.src = BlankProfile}
        alt={`User ${user.firstName}`}
      />
      <h2 className='h-full w-full ml-4 flex items-center text-xl border-b border-gray-400'>
        {user.firstName} {user.lastName}
      </h2>
      <button
        onClick={callback}
        value={user._id}
        className='text-black border-b border-gray-400 h-full'
      >
        <BsPlusCircle size='32' />
      </button>
    </li>
  );
};

