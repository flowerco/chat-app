import { BsPlusCircle } from 'react-icons/bs';
import { useContext, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { addChat, addContact, search } from '../lib/api';
import { FcSearch } from 'react-icons/fc';
import { ScreenContext } from '../App';
import { debounce } from '../lib/utils';
import BlankProfile from '../assets/blank-profile.png';

const userListDev = [
  {
    _id: 1001,
    firstName: 'Brian',
    lastName: 'Smith',
    img: 'https://res.cloudinary.com/doeffypwo/image/upload/v1664008834/freechat/bki1ed0kngh7dj6vd464.jpg',
  },
  {
    _id: 1002,
    firstName: 'Sidney',
    lastName: 'Smith',
    img: 'https://res.cloudinary.com/doeffypwo/image/upload/v1664008834/freechat/bki1ed0kngh7dj6vd464.jpg',
  },
  {
    _id: 1003,
    firstName: 'Tom',
    lastName: 'Smith',
    img: 'https://res.cloudinary.com/doeffypwo/image/upload/v1664008834/freechat/bki1ed0kngh7dj6vd464.jpg',
  },
  {
    _id: 1004,
    firstName: 'Gillian',
    lastName: 'Smith',
    img: 'https://res.cloudinary.com/doeffypwo/image/upload/v1664008834/freechat/bki1ed0kngh7dj6vd464.jpg',
  },
  {
    _id: 1005,
    firstName: 'Wilbur',
    lastName: 'Smith',
    img: 'https://res.cloudinary.com/doeffypwo/image/upload/v1664008834/freechat/bki1ed0kngh7dj6vd464.jpg',
  },
  {
    _id: 1006,
    firstName: 'Smithy',
    lastName: 'Smith',
    img: 'https://res.cloudinary.com/doeffypwo/image/upload/v1664008834/freechat/bki1ed0kngh7dj6vd464.jpg',
  },
  {
    _id: 1007,
    firstName: 'Jenny',
    lastName: 'Smith',
    img: 'https://res.cloudinary.com/doeffypwo/image/upload/v1664008834/freechat/bki1ed0kngh7dj6vd464.jpg',
  },
  {
    _id: 1008,
    firstName: 'Sarah',
    lastName: 'Smith',
    img: 'https://res.cloudinary.com/doeffypwo/image/upload/v1664008834/freechat/bki1ed0kngh7dj6vd464.jpg',
  },
];

export default function SearchableList({ listType }) {
  const { screenState, setScreenState } = useContext(ScreenContext);
  const [itemList, setItemList] = useState([]);
  const [searchString, setSearchString] = useState('');

  const handleChange = async (event) => {
    setSearchString(event.target.value);
    const searchList = listType.toLowerCase();
    const searchResult = await search(
      [screenState.currentUser._id, ...screenState.currentUser[searchList]],
      event.target.value
    );
    if (event.target.value === '') {
      setItemList([]);
    } else {
      setItemList(searchResult);
    }
  };

  const handleClick = async (event) => {
    // Use the addContact API to add the contact to the current user.
    const currentUser = screenState.currentUser;
    const newChatOrContactId = event.currentTarget.value;
    console.log('ID of clicked item: ', newChatOrContactId);
    if (listType === 'CONTACTS') {
      await addContact(currentUser._id, newChatOrContactId);
    }
    if (listType === 'CHATS') {
      console.log(`Adding a chat between you (${currentUser._id}) and another user ${newChatOrContactId}`)    
      await addChat(currentUser._id, newChatOrContactId);
    }
    // Close the modal
    setScreenState({
      ...screenState,
      modalState: 'NONE',
      currentUser: {
        ...screenState.currentUser,
        // Update either the chat or the contacts list
        [listType.toLowerCase()]: [...screenState.currentUser[listType.toLowerCase()], newChatOrContactId],
      },
    });
  };

  // When the button on a user is clicked, we want to add that user's id to the list of contacts on the logged
  // in user's document in the db.
  // const handleClick = async (event) => {
  //   const data = await addContact(event.target.user);
  // }

  return (
    <div className='w-full h-full mt-4 flex flex-col justify-center items-center'>
      <div className='w-full h-10 px-4 flex items-center'>
        <input
          autoFocus
          onChange={(event) => debounce(handleChange(event))}
          value={searchString}
          className='w-full h-full rounded-full pl-6'
          type='text'
          placeholder={`Search for ${listType.toLowerCase()}...`}
        />
        <button disabled type='submit' className='w-6 h-6 object-cover -ml-8'>
          <FaSearch size='20' />
        </button>
      </div>
      {/* TODO: Return either UserItem or ChatItem depending on the listType */}
      <div className='w-full grow mt-4 flex justify-center items-center'>
        {itemList.length > 0 ? (
          <ul className='h-full w-full overflow-scroll flex flex-col justify-start items-center px-6 gap-2'>
            {itemList.map((item) => {
              return (
                <UserItem key={item._id} user={item} callback={handleClick} />
              );
            })}
          </ul>
        ) : (
          <FcSearch size='150' />
        )}
      </div>
    </div>
  );
}

const UserItem = ({ user, callback }) => {
  return (
    <li className='w-full h-12 flex justify-between items-center bg-grey-200 '>
      <img
        className='h-full aspect-square object-cover rounded-full'
        src={user.img || BlankProfile}
        onError={(event) => event.target.src = BlankProfile}
        alt={`User ${user.firstName}`}
      />
      <h2 className='h-full w-full ml-4 flex items-center text-xl border-b border-gray-400'>
        {user.firstName} {user.lastName}
      </h2>
      <button
        onClick={callback}
        value={user._id}
        className='text-black border-b border-gray-400 h-full'
      >
        <BsPlusCircle size='32' />
      </button>
    </li>
  );
};

// function SearchBar({ type, callback }) {
//   const [search, setSearch] = useState('');

//   const handleChange = (event) => {
//     setSearch(event.target.value);
//     callback(event.target.value);
//   }

//   return (
//     <div className='w-full my-4 flex flex-col justify-center items-center' >
//       <div className='w-full h-10 mt-4 px-4 flex items-center'>
//         <input
//           onChange={handleChange}
//           value={search}
//           className='w-full h-full rounded-full pl-6'
//           type='text'
//           placeholder={`Search for ${type.toLowerCase()}...`}
//         />
//         <button disabled type='submit' className='w-6 h-6 object-cover -ml-8'>
//           <FaSearch size='20' />
//         </button>
//       </div>
//       {}
//     </div>
//   );
// }
