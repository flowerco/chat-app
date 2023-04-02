import { useContext } from "react"
import { ScreenContext } from "../../App"

export default function ChatBubble({ chatItem }) {

  const { screenState } = useContext(ScreenContext);

  const userId = screenState.currentUser._id;

  return (
    <div className={`w-3/4 border border-slate-500 rounded-md px-4 py-2
    ${userId === chatItem.id ? 'bg-fuchsia-600 self-end' : 'bg-yellow-600'}`}>
      <div className="flex flex-col">
        <p className="text-md">{chatItem.text}</p>
        <p className="text-xs">{chatItem.timeStamp.toLocaleString()}</p>
      </div> 
  </div>
  )

}