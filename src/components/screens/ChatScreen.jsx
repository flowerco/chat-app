import { useContext, useState } from "react";
import { ScreenContext } from "../../App";
import BubbleList from "../messages/BubbleList";
import ChatForm from "../messages/ChatForm";

const initialChats = {
  "6420a39af84077a288f95dc1": [
    {
      id: "6420a39af84077a288f95dc1",
      timeStamp: new Date(Date.now() - 10 * 60000),
      text: 'Hi, this is Testy. How are you?'
    },
    {
      id: "6420a872f1863098e94830b6",
      timeStamp: Date.now(),
       text: 'Hi Testy. Not bad thanks!'
    }
  ]
}

export default function ChatScreen({ contactId }) {

  const [chatState, setChatState] = useState(initialChats);
  const { screenState, setScreenState } = useContext(ScreenContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    // 1. Update the state as it appears on the screen.
    setChatState({
      ...chatState,
      contactId: [
        ...chatState.contactId,
        {
          id: screenState.currentUser._id,
          timeStamp: Date.now(),
          text: event.target.value
        }
      ]
    });
    // 2. Send to the contact via websocket, ideally with some encryption...

    // 3. Save the new state to eg. localStorage, ideally with some encryption...
  }

  return (
    <div className="w-full h-full ml-16">
      <BubbleList chat={chatState[contactId]} />
      <ChatForm callback={handleSubmit} />
    </div>
  )
}