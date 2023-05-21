import { useState } from 'react';
import { socket } from '../../lib/socket';
import ClipLoader from 'react-spinners/ClipLoader';

export default function ChatForm({ callback }) {
  const [formState, setFormState] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setFormState(event.target.value);
  };

  const onEnterPress = (event) => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault();
      handleSubmit(event);
    }
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
      callback(message);
      setFormState('');
    }
  }

  return (
    <form
      className='fixed bottom-0 left-0 w-full h-24
      flex justify-center items-end pb-4 pl-28 pr-12'
      onSubmit={handleSubmit}
    >
      <textarea
        className='h-16 w-2/3 rounded-md px-6 py-2  mr-4 text-lg'
        autoFocus
        type='textarea'
        value={formState}
        name='message'
        onKeyDown={onEnterPress}
        onChange={handleChange}
        placeholder='Enter Message Here...'
      />
      <button
        type='submit'
        disabled={isLoading}
        className='bg-blue-500 h-8 w-1/4 max-w-[8rem] rounded-md font-semibold text-lg text-white'
      >
        Send
      </button>
    </form>
  );
}
