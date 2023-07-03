import { useDispatch, useSelector } from 'react-redux';
import { fetchChatForContact } from '../lib/api';
import { hideSidebar } from '../redux/screenSlice';
import BlankProfile from '../assets/blank-profile.png';
import { capitaliseFirstLetter } from '../lib/utils';
import { MdDelete } from 'react-icons/md';
import { BsChatLeftDots } from 'react-icons/bs';
import {
  createNewChat,
  deleteContactFromList,
  loadExistingChat
} from '../lib/chatUtils';

export default function ContactsList({ searchString }) {
  const authState = useSelector((state) => state.auth);
  const screenState = useSelector((state) => state.screen);
  const contactsState = useSelector((state) => state.contacts);
  const dispatch = useDispatch();

  const contactsList = contactsState.contacts.filter((contact) => {
    return searchString
      ? [contact.firstName, contact.lastName]
          .join(' ')
          .toLowerCase()
          .includes(searchString)
      : true;
  });

  const handleClick = async (event, contact) => {
    // Either go to start the chat with this user, or delete the user.
    if (screenState.editMode) {
      // Edit mode on, so delete the contact
      await deleteContactFromList(authState, contact, dispatch);
    } else {
      // Edit mode off, so go to the selected chat.
      // First check if there is already a chat for that contact
      console.log('Check to see if chat exists');
      let chatId = await fetchChatForContact(
        authState.currentUser._id,
        contact._id
      );

      console.log('Chat ID returned for contact: ', chatId);

      // ERROR!!! TODO: the function above creates a new chat if one doesn't exist!!!
      // So there is always one found and we try to pull it from localStorage and
      // fail. We never create the new chat so it doesn't get added to the redux chat state...

      // Then either:
      // 1) get the ID if it exists or
      // 2) create a chat if one doesn't exist.
      if (chatId) {
        console.log('It exists already, load it from local storage');
        loadExistingChat(authState, chatId, contact, dispatch);
      } else {
        console.log('It doesn\'t exist, create a new chat');
        createNewChat(authState.currentUser._id, contact, dispatch);
      }

      dispatch(hideSidebar());
    }
  };

  return (
    <ul className='w-full h-full overflow-scroll flex flex-col justify-start items-center px-6 gap-2'>
      {contactsList.length > 0 ? (
        contactsList.map((contact) => {
          return (
            <ContactItem
              key={contact._id}
              contact={contact}
              edit={screenState.editMode}
              callback={handleClick}
            />
          );
        })
      ) : (
        <p className='text-center'>No contacts here yet, let's add some!</p>
      )}
    </ul>
  );
}

const ContactItem = ({ contact, edit, callback }) => {
  return (
    <li className='w-full h-12 flex justify-between items-center bg-grey-200 '>
      <img
        className='h-full aspect-square object-cover rounded-full'
        src={contact.userImg || BlankProfile}
        alt={`Contact ${contact.firstName}`}
        onError={(event) => (event.target.src = BlankProfile)}
      />
      <h2 className='h-full w-full ml-4 flex items-center text-xl border-b border-gray-400'>
        {capitaliseFirstLetter(contact.firstName)}{' '}
        {capitaliseFirstLetter(contact.lastName)}
      </h2>
      <button
        onClick={(event) => callback(event, contact)}
        className='text-black border-b border-gray-400 h-full'
      >
        {/* TODO: Would a red circle with a white 'minus' sign be better here? */}
        {edit ? <MdDelete size='28' /> : <BsChatLeftDots size='24' />}
      </button>
    </li>
  );
};
