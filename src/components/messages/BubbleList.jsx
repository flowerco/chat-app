import { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';

export default function BubbleList({ bubbleList }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => scrollToBottom(), [bubbleList]);

  return (
    <div className='w-full h-full max-w-5xl mb-24 pt-4 px-4 overflow-y-scroll'>
      <div className='w-full h-full flex flex-col gap-2'>
        {bubbleList.length > 0
          ? bubbleList.map((chat, index) => (
              <ChatBubble key={index} chatItem={chat} />
            ))
          : 'No chats here yet!'}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
}
