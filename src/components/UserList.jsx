import { useContext } from 'react';
import { BsChatLeftDots } from 'react-icons/bs';
import { ScreenContext } from '../App';
import { addContact } from '../lib/api';
import BlankProfile from '../assets/blank-profile.png';

const userListDev = [
  { _id: 1001, firstName: 'Brian', lastName: 'Smith', img: 'https://res.cloudinary.com/doeffypwo/image/upload/v1664008834/freechat/bki1ed0kngh7dj6vd464.jpg' },
  { _id: 1002, firstName: 'Sidney', lastName: 'Smith', img: 'https://res.cloudinary.com/doeffypwo/image/upload/v1664008834/freechat/bki1ed0kngh7dj6vd464.jpg' },
  { _id: 1003, firstName: 'Tom', lastName: 'Smith', img: 'https://res.cloudinary.com/doeffypwo/image/upload/v1664008834/freechat/bki1ed0kngh7dj6vd464.jpg' },
  { _id: 1004, firstName: 'Gillian', lastName: 'Smith', img: 'https://res.cloudinary.com/doeffypwo/image/upload/v1664008834/freechat/bki1ed0kngh7dj6vd464.jpg' },
  { _id: 1005, firstName: 'Wilbur', lastName: 'Smith', img: 'https://res.cloudinary.com/doeffypwo/image/upload/v1664008834/freechat/bki1ed0kngh7dj6vd464.jpg' },
  { _id: 1006, firstName: 'Smithy', lastName: 'Smith', img: 'https://res.cloudinary.com/doeffypwo/image/upload/v1664008834/freechat/bki1ed0kngh7dj6vd464.jpg' },
  { _id: 1007, firstName: 'Jenny', lastName: 'Smith', img: 'https://res.cloudinary.com/doeffypwo/image/upload/v1664008834/freechat/bki1ed0kngh7dj6vd464.jpg' },
  { _id: 1008, firstName: 'Sarah', lastName: 'Smith', img: 'https://res.cloudinary.com/doeffypwo/image/upload/v1664008834/freechat/bki1ed0kngh7dj6vd464.jpg' },
];

export default function UserList({ users }) {

  const {screenState, setScreenState} = useContext(ScreenContext);

  const handleClick = (event) => {
    // Use the addContact API to add the contact to the current user.
    console.log(event);
    // Close the modal
  }

  return (
    <ul className='w-full h-[calc(100%-275px)] overflow-scroll flex flex-col justify-start items-center px-6 gap-2'>
      {users.map((user) => {
        return <UserItem key={user._id} user={user} callback={handleClick}/>;
      })}
    </ul>
  );
}

const UserItem = ({ user, type, callback }) => {

  // The userItem can either be type searchedUser, which has a '+' button to add to contacts list, or
  // type contact, which has a 'chat' button to start/resume a chat.

  return (
    <li className='w-full h-12 flex justify-between items-center bg-grey-200 '>
      <img className='h-full aspect-square object-cover rounded-full' src={user.img || BlankProfile} alt={`User ${user.firstName}`} />
      <h2 className='h-full w-full ml-4 flex items-center text-xl border-b border-gray-400'>
        {user.firstName} {user.lastName}
      </h2>
      <button onClick={() => {console.log('Hi, thanks for clicking!')}} className='text-black border-b border-gray-400 h-full'>
        <BsChatLeftDots size='24' />
      </button>
    </li>
  );
};
