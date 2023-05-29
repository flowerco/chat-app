import { memo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import ChatBubble from './ChatBubble';
import { saveState } from '../../lib/localStorage';

function BubbleList() {

  const messagesEndRef = useRef(null);
  const currentChatId = useSelector(state => state.auth.currentUser.currentChat)
  const chatState = useSelector(state => state.auth.currentChat);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.bubbleList]);


  // Might be overkill to avoid one save of the state to localStorage, but we don't want to save on
  // the first render since this is immediately after the load and there will be no changes to save.

  // Custom hook to compare the current value of state/props to the previous value
  function useCompare (val) {
    let prevVal = usePrevious(val)
    console.log(`Prev val: ${prevVal} vs. new val: ${val}`);
    return prevVal !== val;
  }
  
  // Helper hook
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  const hasChatIdChanged = useCompare(currentChatId);

  useEffect(() => {
    if (hasChatIdChanged) {
      console.log('Chat ID updated, so a new chat loaded, so don\'t save the state');
      return;
    }
    console.log('Saving chat state in my new fancy useEffect');
    saveState(currentChatId, chatState);
  }, [hasChatIdChanged, currentChatId, chatState]);


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

export const MemoisedBubbleList = memo(BubbleList);