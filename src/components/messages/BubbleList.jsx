import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import ChatBubble from './ChatBubble';

export default function BubbleList() {

  const messagesEndRef = useRef(null);
  const chatState = useSelector(state => state.auth.currentChat);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => scrollToBottom(), [chatState.bubbleList]);

  return (
    <div className='w-full h-full max-w-5xl mb-24 pt-4 px-4 overflow-y-scroll'>
      <div className='w-full h-full flex flex-col gap-2'>
        {chatState.bubbleList.length > 0
          ? chatState.bubbleList.map((chat, index) => (
              <ChatBubble key={index} chatItem={chat} />
            ))
          : 'No chats here yet!'}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
}
