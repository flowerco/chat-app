import { useContext, useEffect, useState } from 'react';
import { ScreenContext } from '../../App';
import BubbleList from '../messages/BubbleList';
import ChatForm from '../messages/ChatForm';
import BlankProfile from '../../assets/blank-profile.png';
import FlowerCo from '../../assets/flowerco_logo.png';
import { capitaliseFirstLetter } from '../../lib/utils';
import { useSelector } from 'react-redux';

const initialChats = [
  {
    _id: '6450cce396a128fcc79e2472',
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
];

export default function ChatScreen({ chat }) {
  const [chatState, setChatState] = useState(initialChats[0]);

  const authState = useSelector(state => state.auth);

  const handleSubmit = (event) => {
    // 1. Update the state as it appears on the screen.
    setChatState({
      ...chatState,
      bubbleList: [
        ...chatState.bubbleList,
        {
          _id: authState.currentUser._id,
          timeStamp: new Date(Date.now()),
          text: event.target.message.value,
        }
      ]
    });
    // 2. Send to the contact via websocket, ideally with some encryption...

    // 3. Save the new state to eg. localStorage, ideally with some encryption...
  };

  // useEffect(() => {
  //   console.log('Latest chat state is: ', chatState);
  // }, [chatState]);

  return (
    <div className='w-full h-full ml-16 flex flex-col justify-center items-center bg-teal-500'>
      <div className='w-full h-16 flex justify-between items-center px-4 bg-blue-500 text-white'>
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
        <div className='h-full flex justify-end items-center'>
          <p>
            Chatting to{' '}
            <span className='text-yellow-400 font-bold'>{capitaliseFirstLetter(chat.firstName)}</span>
          </p>
          <img
            className='h-full p-2 aspect-square object-cover rounded-full'
            src={chat.userImg || BlankProfile}
            onError={(event) => (event.target.src = BlankProfile)}
            alt={`Contact`}
          />
        </div>
      </div>
      <BubbleList bubbleList={chatState.bubbleList} />
      <ChatForm callback={handleSubmit} />
    </div>
  );
}
