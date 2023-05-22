import BlankProfile from '../../assets/blank-profile.png';
import { useState } from 'react';
import UploadWidget from '../UploadWidget';

export default function Settings({ user }) {
  // Settings required:
  // 1. Edit Name / Picture
  // 2. Allow your profile to be searchable?
  // 3. How many days to store messages
  // 4. TODO: Generate invite code?

  const [checkedOne, setCheckedOne] = useState(true);
  const [checkedTwo, setCheckedTwo] = useState(true);
  const [daysToKeep, setDaysToKeep] = useState(10);

  const handleClickOne = () => {
    setCheckedOne(!checkedOne);
  };

  const handleClickTwo = () => {
    setCheckedTwo(!checkedTwo);
  };

  const handleChange = (event) => {
    let value;
    if (event.target.value !== '') {
      value = Math.max(0, Math.min(9999, Number(event.target.value)));
    } else {
      value = '';
    }
    setDaysToKeep(value);
  };

  const image = user.userImg || BlankProfile;

  return (
    <div className='h-full w-full py-6 px-4'>
      <div className='flex flex-col'>
        <div className='flex justify-between items-center'>
          <div className='image relative inline-block'>
            <div className='overlay absolute bottom-0 right-0 z-30 translate-x-3'>
              <UploadWidget />
            </div>
            <img
              className='h-20 w-20 rounded-full bg-cover'
              src={image}
              alt='Your profile'
            />
          </div>
          <div className='flex flex-col flex-grow text-center'>
            <h1 className='text-3xl text-white'>
              {user.firstName} {user.lastName}
            </h1>
          </div>
        </div>
        <ul className='mt-4 space-y-2'>
          <li className='flex'>
            Allow profile to be searched by all users?{' '}
            <input
              type='checkbox'
              className='h-8 w-8 accent-teal-500 text-red-400'
              checked={checkedOne}
              onChange={handleClickOne}
            />
          </li>
          <li className='flex'>
            Allow only friends to send chat requests?{' '}
            <input
              type='checkbox'
              className='h-8 w-8 accent-teal-500 text-red-400'
              checked={checkedTwo}
              onChange={handleClickTwo}
            />
          </li>
          <li>
            Store messages for{' '}
            <input
              type='number'
              value={daysToKeep}
              onChange={handleChange}
              className='w-16 pl-2 rounded-sm'
            ></input>{' '}
            days.
          </li>
        </ul>
      </div>
    </div>
  );
}
