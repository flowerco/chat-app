import { useEffect, useState } from 'react';
import BubbleList from '../messages/BubbleList';
import ChatForm from '../messages/ChatForm';
import BlankProfile from '../../assets/blank-profile.png';
import FlowerCo from '../../assets/flowerco_logo.png';
import { capitaliseFirstLetter } from '../../lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatById } from '../../lib/api';
import { socket } from '../../lib/socket';
import SocketTestButtons from './SocketTestButtons';
import { chatAddMessage, chatInitialiseMessages } from '../../redux/chatSlice';

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

export default function ChatScreen({ chatId }) {
  // const [chatState, setChatState] = useState(initialState);
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    userImg: '',
  });

  const authState = useSelector((state) => state.auth);
  const chatState = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const updateChatState = (message) => {
    // 1. Update the state as it appears on the screen.
    dispatch(chatAddMessage({ senderId: authState.currentUser._id, message }));
    // 2. Send to the contact via websocket, ideally with some encryption...
    socket.emit('send-message', chatId, authState.currentUser._id, message);
    // 3. Save the new state to eg. localStorage, ideally with some encryption...
  };

  useEffect(() => {

    // On first render we fetch the details of the other user(s) in this chat
    const fetchContactData = async (chatId) => {
      console.log(`fetching chat with id ${chatId} for user ${authState.currentUser._id}`);
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

      // Fetch the chat data from local storage and update the state.
      const filteredChats = mockChats[chatId];
      dispatch(chatInitialiseMessages(filteredChats || initialState));

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
            <p>
              Chatting to{' '}
              <span className='text-yellow-400 font-bold'>
                {capitaliseFirstLetter(contact.firstName)}
              </span>
            </p>
            <img
              className='h-full p-2 aspect-square object-cover rounded-full'
              src={contact.userImg || BlankProfile}
              onError={(event) => (event.target.src = BlankProfile)}
              alt={`Contact`}
            />
          </div>
        )}
      </div>
      <BubbleList bubbleList={chatState.bubbleList} />
      <ChatForm callback={updateChatState} />
      {/* <SocketTestButtons /> */}
    </div>
  );
}
