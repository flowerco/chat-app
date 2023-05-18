import { useContext, useEffect, useState } from 'react';
import { ScreenContext } from '../../App';
import BubbleList from '../messages/BubbleList';
import ChatForm from '../messages/ChatForm';
import BlankProfile from '../../assets/blank-profile.png';
import FlowerCo from '../../assets/flowerco_logo.png';
import { capitaliseFirstLetter } from '../../lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatById } from '../../lib/api';
import { socketSetConnected } from '../../redux/socketSlice';
import { socket } from '../../lib/socket';

const mockChats = [
  {
    _id: '646167d3681aa1995ff3b5ab',
    userList: ['644f91e25dd6e3a045fa7cd6', '644f98214cb784ed82566245'],
    bubbleList: [
      {
        _id: '644f98214cb784ed82566245',
        timeStamp: new Date(Date.now() - 10 * 60000),
        text: "Hi, this is Testmore. Without concern for one's personal safety it seems appropriate to enquire whether or not you might prefer to engage in a ribald conversation the like of which shall not be heard of for many an age, perhap until the next ice age hath come and gone yonder from the great plains and shores of our fair land. Or nah?",
      },
      {
        _id: '644f91e25dd6e3a045fa7cd6',
        timeStamp: new Date(Date.now()),
        text: 'Hi Testy. Not bad thanks!',
      },
    ],
  },
  {
    _id: '645fcb6ab45eea8e8987e3c2',
    userList: ['644f91e25dd6e3a045fa7cd6', '644f94bd2cc7d61b26df5924'],
    bubbleList: [
      {
        _id: '644f98214cb784ed82566245',
        timeStamp: new Date(Date.now() - 10 * 60000),
        text: 'Bonjour, mon amis.',
      },
      {
        _id: '644f91e25dd6e3a045fa7cd6',
        timeStamp: new Date(Date.now()),
        text: 'Whaaaasssuuuup?',
      },
    ],
  },
];

const initialState = {
  _id: '',
  userList: [],
  bubbleList: [],
};

export default function ChatScreen({ chatId }) {
  const [chatState, setChatState] = useState(initialState);
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    userImg: '',
  });

  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const updateChatState = (message) => {
    // 1. Update the state as it appears on the screen.
    setChatState({
      ...chatState,
      bubbleList: [
        ...chatState.bubbleList,
        {
          _id: authState.currentUser._id,
          timeStamp: new Date(Date.now()),
          text: message,
        },
      ],
    });
    // 2. Send to the contact via websocket, ideally with some encryption...

    // 3. Save the new state to eg. localStorage, ideally with some encryption...
  };

  useEffect(() => {
    // On first render we fetch the details of the other user(s) in this chat
    const fetchContactData = async (chatId) => {
      let chatData = await fetchChatById(authState.currentUser._id, chatId);
      let contact = null;
      if (chatData) {
        contact = chatData.userList[0];
      }
      return contact;
    };

    if (chatId) {
      fetchContactData(chatId).then((data) => {
        setContact(data);
      });
    }

    const filteredChats = mockChats.filter((chat) => chat._id === chatId);
    setChatState(filteredChats[0] || initialState);
  }, [authState, chatId]);

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
          {/* <p className='text-yellow-400 font-bold text-2xl'>Freechat</p> */}
          {/* <p className='text-sm'> by FlowerCo</p> */}
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
      <div className='flex flex-col justify-center items-center fixed m-auto gap-2' >
        <button
          className='px-8 h-20 text-white bg-primary rounded-md'
          onClick={(e) => socket.connect()}
        >
          Connect
        </button>
        <button
          className='px-8 h-20 text-white bg-primary rounded-md'
          onClick={(e) => socket.disconnect()}
        >
          Disconnect
        </button>
        <button
          className='px-8 h-20 text-white bg-primary rounded-md'
          // TODO: THIS JUST GOES STRAIGHT TO THE SERVER - HANDLE IT THERE!
          onClick={(e) => socket.emit('join-chat', '1000234', 'Sam')}
        >
          Join
        </button>
        <button
          className='px-8 h-20 text-white bg-primary rounded-md'
          onClick={(e) => socket.emit('send-message', 'wibble')}
        >
          Emit
        </button>
      </div>
    </div>
  );
}
