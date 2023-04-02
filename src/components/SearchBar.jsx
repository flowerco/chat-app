import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar({ type, callback }) {
  const [search, setSearch] = useState('');
  
  const handleChange = (event) => {
    setSearch(event.target.value);
    callback(event.target.value);
  }

  return (
    <div className='w-full h-10 my-4 px-4 flex items-center'>
      <input
        onChange={handleChange}
        value={search}
        className='w-full h-full rounded-full pl-6'
        type='text'
        placeholder={`Search for ${type.toLowerCase()}...`}
      />
      <button disabled type='submit' className='w-6 h-6 object-cover -ml-8'>
        <FaSearch size='20' />
      </button>
    </div>
  );
}
