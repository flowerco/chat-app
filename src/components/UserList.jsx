import { BsChatLeftDots } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { deleteChat, deleteContact, fetchChatById, fetchChatForContact, updateCurrentChat } from '../lib/api';
import BlankProfile from '../assets/blank-profile.png';
import { capitaliseFirstLetter } from '../lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { authDeleteChat, authDeleteContact, authUpdateCurrentChat } from '../redux/authSlice';
import { hideSidebar } from '../redux/screenSlice';
import { socket } from '../lib/socket';


export default function UserList({ users, type }) {

  const authState = useSelector(state => state.auth);
  const screenState = useSelector(state => state.screen);
  const dispatch = useDispatch();

  const handleClick = async (event, item) => {
    // Either go to /start the chat with this user, or delete the user.
    console.log('The item is...', item);
    if (screenState.editMode) {
      // Check if your currently showing the chat you're about to delete, or if the contact you're deleting is the one you're currently chatting with.
      // TODO: Wondering now if this unification of the ContactList and ChatList components is more trouble than it's worth... so many more if conditions!
      let isCurrentChat = false;
      if (type === 'CONTACTS') {
        const chatData = await fetchChatById(authState.currentUser._id, authState.currentUser.currentChat);
        if (chatData) {
          isCurrentChat = chatData.userList[0]._id === item.unqKey;
        }
      } else {
        isCurrentChat = screenState.currentChat === item.unqKey;
      } 

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
          dispatch(authUpdateCurrentChat(''));
        }
      }
      await updateContactList();
      
    } else {
      console.log(`Start chat with user: `, event.currentTarget.value);
      // If we clicked an existing chat, then no problem just find that chat from the ID
      let chatId = item.unqKey;
      console.log('Set current chat to: ', chatId);
      // If we clicked a contact then we need to check if there is already a chat for that contact, 
      // then either: 1) get the ID if it exists or 2) create a chat if one doesn't exist.
      if (type === 'CONTACTS') {
        chatId = await fetchChatForContact(authState.currentUser._id, item.unqKey);
      }

      await updateCurrentChat(authState.currentUser._id, chatId);
      // We can just update the currentChat state with the current chat ID
      dispatch(authUpdateCurrentChat(chatId));
      dispatch(hideSidebar());
    }
  };


  return (
    <ul className='w-full h-full overflow-scroll flex flex-col justify-start items-center px-6 gap-2'>
      {users.map((user) => {
        return (
          <UserItem
            key={user.unqKey}
            user={user}
            edit={screenState.editMode}
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
