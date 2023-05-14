import { useEffect } from "react"
import { useSelector } from "react-redux";

export default function ChatBubble({ chatItem }) {

  const authState = useSelector(state => state.auth);
  const userId = authState.currentUser._id;

  const isOnlyEmoji = (testString) => {
    return /^\p{Extended_Pictographic}+$/u.test(testString);
  }

  const textSize = isOnlyEmoji(chatItem.text) ? 'text-6xl' : 'text-md';

  // useEffect(() => {
    // console.log('Rendering chat item for user: ', chatItem._id);
    // console.log('Current logged in user: ', userId);
  // }, [chatItem, userId])

  return (
    <div className={`max-w-5/6 border border-slate-500 rounded-md px-4 py-2
    ${userId === chatItem._id ? 'bg-fuchsia-600 self-end text-white' : 'bg-yellow-600 self-start'}`}>
      <div className="flex flex-col">
        <p className={textSize}>{chatItem.text}</p>
        <p className="text-xs mt-1">{chatItem.timeStamp.toLocaleString()}</p>
      </div> 
  </div>
  )

}