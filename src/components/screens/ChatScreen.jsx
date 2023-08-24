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
  // TODO: This contact needs to have their online status updated after a socket.io event.
  // So either we make the state part of redux, or we add a new listener to the 'online-user'
  // event within this component.
  // Redux is complicated enough for now. Let's listen for the event here.
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    userImg: '',
    online: false,
  });

  const authState = useSelector((state) => state.auth);
  const chatId = authState.currentUser.currentChat;

  useEffect(() => {
    const fetchContactData = async (chatId) => {
      // To ensure this is scalable, we go back to the DB here. Eventually there may be
      // too many chats/contacts to pull them all into memory at once, so the chat we're
      // looking for might not be in the redux state.
      let chatData = await fetchChatById(authState.currentUser._id, chatId);
      let contact = null;
      if (chatData) {
        contact = chatData.userList[0];
      }
      console.log('Contact for current chat: ', contact);
      return contact;
    };

    if (chatId) {
      // Fetch the contact data for this chat from the server.
      fetchContactData(chatId).then((data) => {
        setContact(data);
      });

      // Connect to the chat via socket.io
      // TODO: Remove this. Thechat connection status is no longer used, just online
      // or offline.
      socket.emit('join-chat', chatId, authState.currentUser.firstName);
    } else {
      // console.log('No chat ID on this render...');
    }

    return () => {
      socket.emit('leave-chat', chatId, authState.currentUser.firstName);
    };
  }, [authState.currentUser, chatId]);

  useEffect(() => {
    function setChatOnline(userId) {
      // console.log('Setting current chat online.');
      if (userId === contact._id.toString()) {
        setContact({ ...contact, online: true });
      }
    }
    function setChatOffline(userId) {
      // console.log('Setting current chat offline.');
      if (userId === contact._id.toString()) {
        setContact({ ...contact, online: false });
      }
    }
    socket.on('user-online', setChatOnline);
    socket.on('user-offline', setChatOffline);
    return () => {
      socket.off('user-online', setChatOnline);
      socket.off('user-offline', setChatOffline);
    };
    // Only want to set up listeners when the chat screen is first rendered.
    // Changes to the specific contact should not update the listeners.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='w-full h-full ml-16 flex flex-col justify-center items-center bg-secondary'>
      <TitleBar contact={contact} />
      <MemoisedBubbleList />
      <ChatForm userId={authState.currentUser._id} chatId={chatId} />
    </div>
  );
}

function TitleBar({ contact }) {
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
