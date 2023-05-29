import { useEffect, useState } from 'react';
import BubbleList, { MemoisedBubbleList } from '../messages/BubbleList';
import ChatForm from '../messages/ChatForm';
import BlankProfile from '../../assets/blank-profile.png';
import FlowerCo from '../../assets/flowerco_logo.png';
import { capitaliseFirstLetter } from '../../lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatById } from '../../lib/api';
import { socket } from '../../lib/socket';
import SocketTestButtons from './SocketTestButtons';
import { chatAddMessage, chatInitialiseMessages } from '../../redux/authSlice';

const mockChats = {
  '646167d3681aa1995ff3b5ab': {
    userList: ['644f91e25dd6e3a045fa7cd6', '644f98214cb784ed82566245'],
    bubbleList: [
      {
        _id: '644f98214cb784ed82566245',
        timeStamp: new Date(Date.now() - 10 * 60000).toISOString(),
        text: "Hi, this is Testmore. Without concern for one's personal safety it seems appropriate to enquire whether or not you might prefer to engage in a ribald conversation the like of which shall not be heard of for many an age, perhap until the next ice age hath come and gone yonder from the great plains and shores of our fair land. Or nah?",
      },
      {
        _id: '644f91e25dd6e3a045fa7cd6',
        timeStamp: new Date(Date.now()).toISOString(),
        text: 'Hi Testy. Not bad thanks!',
      },
    ],
  },
  '645fcb6ab45eea8e8987e3c2': {
    userList: ['644f91e25dd6e3a045fa7cd6', '644f94bd2cc7d61b26df5924'],
    bubbleList: [
      {
        _id: '644f98214cb784ed82566245',
        timeStamp: new Date(Date.now() - 10 * 60000).toISOString(),
        text: 'Bonjour, mon amis.',
      },
      {
        _id: '644f91e25dd6e3a045fa7cd6',
        timeStamp: new Date(Date.now()).toISOString(),
        text: 'Whaaaasssuuuup?',
      },
    ],
  },
};

const initialState = {
  userList: [],
  bubbleList: [],
};


export default function ChatScreen() {
  // const [chatState, setChatState] = useState(initialState);
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    userImg: '',
  });

  const authState = useSelector((state) => state.auth);
  const chatId = authState.currentUser.currentChat;

  useEffect(() => {
    // On first render we fetch the details of the other user(s) in this chat
    const fetchContactData = async (chatId) => {
      console.log(
        `fetching contact data for chat ID ${chatId} on user ${authState.currentUser._id}`
      );
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
      console.log('No chat ID on this render...');
    }

    return () => {
      socket.emit('leave-chat', chatId, authState.currentUser.firstName);
    };
  }, [authState.currentUser, chatId]);


  return (
    <div className='w-full h-full ml-16 flex flex-col justify-center items-center bg-teal-500'>
      <TitleBar contact={contact} />
      <MemoisedBubbleList />
      <ChatForm userId={authState.currentUser._id} chatId={chatId} />
      {/* <SocketTestButtons /> */}
    </div>
  );
}

function TitleBar ({ contact }) {

  const socketState = useSelector(state => state.socket);
  const authState = useSelector(state => state.auth);

  return (
    <div className='w-full h-20 flex justify-between items-center px-4 bg-primary text-white'>
    <div className='flex flex-col'>
      <p className='flex justify-center items-center'>
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
      <div className='h-full flex justify-end items-center'>
        <div className='h-full p-2 flex flex-col justify-center items-center gap-1'>
          <p className='text-lg'>
            Chatting to{' '}
            <span className='text-yellow-400 font-bold'>
              {capitaliseFirstLetter(contact.firstName)}
            </span>
          </p>
          <div className='h-4 flex gap-2 items-center'>
            <div className={`h-3 w-3 rounded-full ${socketState.isConnected ? 'bg-green-400' : 'bg-red-500'}`}></div>
            <p className='text-sm'>{socketState.isConnected ? 'Online' : 'Offline'}</p>
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
  )

}
