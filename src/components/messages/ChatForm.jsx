import { useState } from 'react';

export default function ChatForm({ callback }) {
  const [formState, setFormState] = useState('');

  const handleChange = (event) => {
    setFormState(event.target.value);
  };

  return (
    <form
      className='fixed bottom-0 left-0 w-full h-14 bg-purple-600
      flex justify-center items-center pl-28 pr-12'
      onSubmit={(event) => {
          callback(event);
          setFormState('');
        }
      }
    >
      <input
        className='h-8 w-3/4 rounded-l-md pl-6'
        type='text'
        value={formState}
        name='message'
        onChange={handleChange}
        placeholder='Enter Message Here...'
      />
      <button type='submit' className='bg-blue-500 h-8 w-1/4 max-w-[10rem] rounded-r-md font-bold text-white'>Send</button>
    </form>
  );
}
