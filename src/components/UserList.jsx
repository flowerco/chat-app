import { BsChatLeftDots } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { deleteChat, deleteContact } from '../lib/api';
import BlankProfile from '../assets/blank-profile.png';
import { capitaliseFirstLetter } from '../lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { authDeleteChat, authDeleteContact } from '../redux/authSlice';
import { removeCurrentChat, updateCurrentChat } from '../redux/screenSlice';


export default function UserList({ users, edit, type }) {

  const authState = useSelector(state => state.auth);
  const screenState = useSelector(state => state.screen);
  const dispatch = useDispatch();

  const handleClick = async (event, item) => {
    // Either go to /start the chat with this user, or delete the user.
    if (edit) {
      // Check if the contact you're deleting is the one you're currently chatting with
      // TODO: Fix this, it doesn't work now that the chatID and userID are different...
      const isCurrentChat = screenState.currentChat._id === item.unqKey

      const updateContactList = async () => {
        // We need to make sure that components fetching contacts when the screenState changes will
        // find the updated contact list, so await the delete before updating the state.
        if (type === 'CONTACTS') {
          await deleteContact(authState.currentUser._id, item.unqKey);
          dispatch(authDeleteContact(item.unqKey));
        } else if (type === 'CHATS') {
          await deleteChat(authState.currentUser._id, item.unqKey);
          dispatch(authDeleteChat(item.unqKey));
        }
        if (isCurrentChat) {
          dispatch(removeCurrentChat());
        }
      }
      await updateContactList();
      
    } else {
      console.log(`Start chat with user: ${event.currentTarget.value}`);
      dispatch(updateCurrentChat(item));
    }
  };


  return (
    <ul className='w-full h-full overflow-scroll flex flex-col justify-start items-center px-6 gap-2'>
      {users.map((user) => {
        return (
          <UserItem
            key={user.unqKey}
            user={user}
            edit={edit}
            callback={handleClick}
          />
        );
      })}
    </ul>
  );
}

const UserItem = ({ user, edit, type, callback }) => {
  // The userItem can either be type searchedUser, which has a '+' button to add to contacts list, or
  // type contact, which has a 'chat' button to start/resume a chat.

  return (
    <li className='w-full h-12 flex justify-between items-center bg-grey-200 '>
      <img
        className='h-full aspect-square object-cover rounded-full'
        src={user.userImg || BlankProfile}
        alt={`User ${user.firstName}`}
      />
      <h2 className='h-full w-full ml-4 flex items-center text-xl border-b border-gray-400'>
        {capitaliseFirstLetter(user.firstName)} {capitaliseFirstLetter(user.lastName)}
      </h2>
      <button
        onClick={(event) => callback(event, user)}
        className='text-black border-b border-gray-400 h-full'
      >
        {/* TODO: Would a red circle with a white 'minus' sign be better here? */}
        {edit ? <MdDelete size='28' /> : <BsChatLeftDots size='24' />}
      </button>
    </li>
  );
};
