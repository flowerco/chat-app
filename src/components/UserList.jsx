import { useContext } from 'react';
import { BsChatLeftDots } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { ScreenContext } from '../App';
import { deleteChat, deleteContact } from '../lib/api';
import BlankProfile from '../assets/blank-profile.png';
import { removeArrayItem } from '../lib/utils';


export default function UserList({ users, edit, type }) {
  const { screenState, setScreenState } = useContext(ScreenContext);

  const handleClick = async (event, item) => {
    // Either go to /start the chat with this user, or delete the user.
    if (edit) {
      const itemIndex = screenState.currentUser[type.toLowerCase()].indexOf(item.unqKey);
      const newItemList = removeArrayItem(screenState.currentUser[type.toLowerCase()], itemIndex);
      console.log('New item list to show in sidebar: ', newItemList)
      // Check if the contact you're deleting is the one you're currently chatting with
      // TODO: Fix this, it doesn't work now that the chatID and userID are different...
      const isCurrentChat = screenState.currentChat._id === item.unqKey

      const updateContactList = async () => {
        // We need to make sure that components fetching contacts when the screenState changes will
        // find the updated contact list, so await the delete before updating the state.
        if (type === 'CONTACTS') {
          await deleteContact(screenState.currentUser._id, item.unqKey);
        } else if (type === 'CHATS') {
          await deleteChat(screenState.currentUser._id, item.unqKey);
        }
        setScreenState({
          ...screenState,
          currentChat: isCurrentChat ? {} : screenState.currentChat,
          currentUser: {
            ...screenState.currentUser,
            [type.toLowerCase()]: newItemList
          }
        });
      }
      await updateContactList();
      
    } else {
      console.log(`Start chat with user: ${event.currentTarget.value}`);
      setScreenState({
        ...screenState,
        sidebarState: 0,
        activeSidebar: 'NONE',
        currentChat: {
          ...item
        }
      });
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
        {user.firstName} {user.lastName}
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
