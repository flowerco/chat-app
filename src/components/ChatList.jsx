import { BsChatLeftDots } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { deleteChat } from '../lib/api';
import BlankProfile from '../assets/blank-profile.png';
import { capitaliseFirstLetter } from '../lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { authDeleteChat, authUpdateCurrentChat } from '../redux/authSlice';
import { hideSidebar } from '../redux/screenSlice';
import { deleteState } from '../lib/localStorage';
import { loadExistingChat } from '../lib/chatUtils';
import { reduxRemoveChat } from '../redux/chatsSlice';

export default function ChatList({ searchString }) {
  const authState = useSelector((state) => state.auth);
  const screenState = useSelector((state) => state.screen);
  const chatState = useSelector((state) => state.chats);
  const dispatch = useDispatch();

  const chatsList = chatState.chats.filter((chat) => {
    // TODO: Allow for multiple contacts in the chat, not just the first user in the list. 
    const contact = chat.userList[0];
    return searchString
      ? [contact.firstName, contact.lastName]
          .join(' ')
          .toLowerCase()
          .includes(searchString)
      : true;
  });

  const handleClick = async (event, chat) => {
    // Either go to join the selected chat or delete the chat, depending on the edit mode.
    if (screenState.editMode) {
      // Check if we're currently showing the chat we're about to delete.
      let isCurrentChat = authState.currentUser.currentChat.toString() === chat._id;

      const updateChatList = async () => {
        // SO MANY STEPS to delete a chat... here goes:
        // 1. Delete the chat from the database
        await deleteChat(authState.currentUser._id, chat._id);
        // 2. Remove the chat from the currentChat state in redux
        dispatch(authDeleteChat(chat._id));
        // 3. Remove the chat from the list of all chats in redux 
        dispatch(reduxRemoveChat(chat._id));
        // 4. Remove the chat saved in localStorage
        deleteState(chat._id);

        // 5. If this is the currently active chat then remove it
        // ERROR!: Is this doing the same as authDeleteChat???
        if (isCurrentChat) {
          dispatch(authUpdateCurrentChat(''));
        }
      };
      await updateChatList();
    } else {
      // Load the chat from localStorage. 
      // If the chat exists in the DB but there's nothing in localStorage it will
      // default to an empty chat.
      await loadExistingChat(authState, chat._id, chat.userList[0], dispatch);
      dispatch(hideSidebar());
    }
  };

  return (
    <ul className='w-full h-full overflow-scroll flex flex-col justify-start items-center px-6 gap-2'>
      {chatsList.length > 0 ? (chatsList.map((chat) => {
        return (
          <ChatItem
            key={chat._id}
            contact={chat.userList[0]}
            edit={screenState.editMode}
            callback={(event) => handleClick(event, chat)}
          />
        );
      })):(
        <p className='text-center'>No chats here yet, let's add some!</p>
      )}
    </ul>
  );
}

// Extension: For multiple users in a chat, this could be a contactList instead of a single contact.
const ChatItem = ({ contact, chatId, edit, callback }) => {
  // The userItem can either be type searchedUser, which has a '+' button to add to contacts list, or
  // type contact, which has a 'chat' button to start/resume a chat.

  return (
    <li className='w-full h-12 flex justify-between items-center bg-grey-200 '>
      <img
        className='h-full aspect-square object-cover rounded-full'
        src={contact.userImg || BlankProfile}
        alt={`User ${contact.firstName}`}
        onError={(event) => (event.target.src = BlankProfile)}
      />
      <h2 className='h-full w-full ml-4 flex items-center text-xl border-b border-gray-400'>
        {capitaliseFirstLetter(contact.firstName)}{' '}
        {capitaliseFirstLetter(contact.lastName)}
      </h2>
      <button
        onClick={(event) => callback(event, contact, chatId)}
        className='text-black border-b border-gray-400 h-full'
      >
        {/* TODO: Would a red circle with a white 'minus' sign be better here? */}
        {edit ? <MdDelete size='28' /> : <BsChatLeftDots size='24' />}
      </button>
    </li>
  );
};
