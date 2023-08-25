import { useState } from 'react';
import { socket } from '../../lib/socket';
import { useDispatch } from 'react-redux';
import { chatAddMessage } from '../../redux/authSlice';

export default function ChatForm({ userId, chatId, online }) {
  const [formState, setFormState] = useState('');
  // const [isLoading] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (event) => {
    setFormState(event.target.value);
  };

  const onEnterPress = (event) => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const updateChatState = (message) => {
    // 1. Update the state as it appears on the screen.
    dispatch(chatAddMessage({ senderId: userId, message }));
    // 2. Send to the contact via websocket
    // TODO: can we encrypt the message?
    // TODO: add a callback as a last argument to acknowledge receipt
    socket.emit('send-message', chatId, userId, message);
  };

  function handleSubmit(event) {
    // The target, and therefore the name/value, changes depending on the source of the submit (Enter key vs. button press)
    const message = event.target.message
      ? event.target.message.value
      : event.target.value;

    console.log('Calling handleSubmit with event: ', message);
    event.preventDefault();
    // setIsLoading(true);
    // socket.emit('send-message', event.target.message.value, () => {
    //   setIsLoading(false);
    // });

    if (message !== '') {
      updateChatState(message);
      setFormState('');
    }
  }

  return (
    <form
      data-testid='message-input'
      className='fixed bottom-0 left-0 w-full h-20
      flex justify-center items-center sm:items-end pb-0 sm:pb-4 pl-16 sm:pl-28 sm:pr-12'
      onSubmit={handleSubmit}
    >
      <textarea
        className='h-16 w-2/3 rounded-md px-2 sm:px-6 py-2 mr-2 sm:mr-4 text-md sm:text-lg'
        autoFocus
        type='textarea'
        value={formState}
        disabled={!online}
        name='message'
        onKeyDown={onEnterPress}
        onChange={handleChange}
        placeholder='New message...'
      />
      <button
        type='submit'
        disabled={!online}
        className={`${
          online ? 'bg-accent' : 'bg-gray-500'
        } text-primary h-16 sm:h-8 
        aspect-square sm:aspect-auto sm:w-1/4 max-w-[8rem] 
        rounded-full sm:rounded-md font-semibold text-md sm:text-lg`}
      >
        Send
      </button>
    </form>
  );
}
