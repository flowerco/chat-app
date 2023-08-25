import { memo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import ChatBubble from './ChatBubble';
import { saveState } from '../../lib/localStorage';

function BubbleList() {
  const messagesEndRef = useRef(null);
  const currentChatId = useSelector(
    (state) => state.auth.currentUser.currentChat
  );
  const chatState = useSelector((state) => state.auth.currentChat);

  const scrollToBottom = (scrollMethod) => {
    messagesEndRef.current?.scrollIntoView({ behavior: scrollMethod });
  };

  // Might be overkill to avoid one save of the state to localStorage, but we don't want to save on
  // the first render since this is immediately after the load and there will be no changes to save.

  // Custom hook to compare the current value of state/props to the previous value
  function useCompare(val) {
    let prevVal = usePrevious(val);
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
    // When first rendering a new chat, show the messages already scrolled to the bottom.
    if (hasChatIdChanged) {
      scrollToBottom('instant');
    } else {
      // On new messages, scroll to the new message smoothly.
      scrollToBottom('smooth');
    }
  }, [chatState.bubbleList, hasChatIdChanged]);

  useEffect(() => {
    if (hasChatIdChanged) {
      // Chat ID updated, which means a new chat loaded, so no need to save the state
      return;
    }
    saveState(currentChatId, chatState);
  }, [hasChatIdChanged, currentChatId, chatState]);

  return (
    <div className='w-full flex-1 max-w-5xl mb-20 sm:mb-24 pt-4 px-4 overflow-y-scroll'>
      <div className='w-full h-full flex flex-col gap-4'>
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
