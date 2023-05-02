import ChatBubble from "./ChatBubble";

export default function BubbleList ( { bubbleList } ) {

  return (
    <div className="w-full h-full max-w-5xl mb-[4.5rem] pt-4 px-4 overflow-y-scroll">
      <div className="w-full h-full flex flex-col gap-2" >
        {bubbleList 
          ? bubbleList.map((chat, index) => <ChatBubble key={index} chatItem={chat} />)
          : 'No chats here yet!'  
        }
      </div>
    </div>
  )
}