import { useContext, useEffect, useState } from "react";
import { ScreenContext } from "../../App";
import BubbleList from "../messages/BubbleList";
import ChatForm from "../messages/ChatForm";
import BlankProfile from '../../assets/blank-profile.png';

const initialChats = {
  "6420a39af84077a288f95dc1": [
    {
      id: "6420a39af84077a288f95dc1",
      timeStamp: new Date(Date.now() - 10 * 60000),
      text: 'Hi, this is Testy. How are you?'
    },
    {
      id: "6420a872f1863098e94830b6",
      timeStamp: new Date(Date.now()),
      text: 'Hi Testy. Not bad thanks!'
    }
  ]
}

export default function ChatScreen({ contactId }) {

  const [chatState, setChatState] = useState(initialChats);
  const { screenState, setScreenState } = useContext(ScreenContext);
  console.log('ContactId prop value is: ', contactId);

  const handleSubmit = (event) => {
    console.log('Submitting new chat item: ', event.target.message.value);
    console.log('Current chatstate keys: ', Object.keys(chatState));
    event.preventDefault();
    // 1. Update the state as it appears on the screen.
    setChatState({
      ...chatState,
      [contactId]: [
        ...chatState[contactId],
        {
          id: screenState.currentUser._id,
          timeStamp: new Date(Date.now()),
          text: event.target.message.value
        }
      ]
    });
    // 2. Send to the contact via websocket, ideally with some encryption...

    // 3. Save the new state to eg. localStorage, ideally with some encryption...
  }

  useEffect(() => {
    console.log('Latest chat state is: ', chatState);
  }, [chatState]);

  return (
    <div className="w-full h-full ml-16 flex flex-col">
      <div className="h-20 flex justify-between items-center px-4 text-white">
        <div className="flex flex-col">
          <p className="text-yellow-400 font-bold text-xl">Freechat </p>
          <p className="text-sm"> by FlowerCo</p>
        </div>
        <div className="h-full flex justify-end items-center">
          <p>Chatting to Jim</p>
         <img className='h-full p-3 aspect-square object-cover rounded-full' src={BlankProfile} alt={`Contact`} />
        </div>
      </div>
      <BubbleList chatList={chatState[contactId]} />
      <ChatForm callback={handleSubmit} />
    </div>
  )
}