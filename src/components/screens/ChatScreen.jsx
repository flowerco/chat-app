import { useEffect, useState } from 'react';
import { MemoisedBubbleList } from '../messages/BubbleList';
import ChatForm from '../messages/ChatForm';
import BlankProfile from '../../assets/blank-profile.png';
import FlowerCo from '../../assets/flowerco_logo.png';
import { capitaliseFirstLetter } from '../../lib/utils';
import { useSelector } from 'react-redux';
import { fetchChatById } from '../../lib/api';
import { socket } from '../../lib/socket';

export default function ChatScreen() {
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    userImg: '',
    online: false,
  });

  const authState = useSelector((state) => state.auth);
  const chatId = authState.currentUser.currentChat;

  useEffect(() => {
    // On first render we fetch the details of the other user(s) in this chat
    // TODO: Shouldn't need to go to the DB any more, this should all sit in redux...
    const fetchContactData = async (chatId) => {
      let chatData = await fetchChatById(authState.currentUser._id, chatId);
      let contact = null;
      if (chatData) {
        contact = chatData.userList[0];
      }
      return contact;
    };

    if (chatId) {
      // Fetch the contact data for this chat from the server.
      fetchContactData(chatId).then((data) => {
        setContact(data);
      });

      // Connect to the chat via socket.io
      socket.emit('join-chat', chatId, authState.currentUser.firstName);
    } else {
      // console.log('No chat ID on this render...');
    }

    return () => {
      socket.emit('leave-chat', chatId, authState.currentUser.firstName);
    };
  }, [authState.currentUser, chatId]);

  return (
    <div className='w-full h-full ml-16 flex flex-col justify-center items-center bg-secondary'>
      <TitleBar contact={contact} />
      <MemoisedBubbleList />
      <ChatForm userId={authState.currentUser._id} chatId={chatId} />
    </div>
  );
}

function TitleBar({ contact }) {
  const socketState = useSelector((state) => state.socket);
  const authState = useSelector((state) => state.auth);

  return (
    <div className='w-full h-20 flex flex-col sm:flex-row justify-between items-center sm:px-4 bg-primary text-white'>
      <div className='hidden sm:flex flex-col'>
        <p className='h-20 flex justify-center items-center'>
          <span className='text-yellow-400 font-semibold text-4xl mr-4'>
            Freechat
          </span>
          by FlowerCo
          <img
            src={FlowerCo}
            className='h-6 w-5 ml-2'
            alt='Small FlowerCo logo'
          />
        </p>
      </div>
      {authState.currentUser.currentChat && (
        <div className='h-20 sm:h-full flex justify-end items-center'>
          <div className='h-8 sm:h-full p-2 flex flex-col justify-center items-center gap-1'>
            <p className='text-lg'>
              Chatting to{' '}
              <span className='text-yellow-400 font-bold'>
                {capitaliseFirstLetter(contact.firstName)}
              </span>
            </p>
            <div className='h-4 flex gap-2 items-center'>
              <div
                className={`h-3 w-3 rounded-full ${
                  contact.online ? 'bg-green-400' : 'bg-red-500'
                }`}
              ></div>
              <p className='text-sm'>{contact.online ? 'Online' : 'Offline'}</p>
            </div>
          </div>
          <img
            className='h-full p-2 aspect-square object-cover rounded-full'
            src={contact.userImg || BlankProfile}
            onError={(event) => (event.target.src = BlankProfile)}
            alt={`Contact`}
          />
        </div>
      )}
    </div>
  );
}
