// Modal popup for either creating account, adding contact or creating new chat.

import { useDispatch } from 'react-redux';
import { closeModal } from '../redux/screenSlice';
import SearchableList from './SearchableList';

export default function Modal({ type }) {
  const dispatch = useDispatch();

  const handleClick = (event) => {
    dispatch(closeModal());
  };

  return (
    <div className='w-full p-2 sm:p-0 h-full flex justify-end sm:justify-center items-center'>
      <div className='z-40 w-full sm:w-5/12 sm:min-w-[400px] sm:ml-12 h-96 bg-slate-200 rounded-3xl flex flex-col justify-around items-center shadow-xl'>
        <SearchableList listType={type} />
        <div className='w-full flex justify-end pr-4 my-4'>
          <button
            className='bg-blue-600 text-white font-semibold px-4 py-2 rounded-md'
            onClick={handleClick}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
