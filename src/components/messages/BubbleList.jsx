import ChatBubble from "./ChatBubble";

export default function BubbleList ( { chatList } ) {

  return (
    <div className="w-full h-full mb-14 bg-teal-500 p-4">
      <div className="w-full h-full flex flex-col gap-2" >
        {chatList.map((chat, index) => <ChatBubble key={index} chatItem={chat} />)}
      </div>
    </div>
  )
}