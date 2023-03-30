import { BsPlusCircle } from 'react-icons/bs';

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

  // When the button on a user is clicked, we want to add that user's id to the list of contacts on the logged
  // in user's document in the db.
  // const handleClick = async (event) => {
  //   const data = await addContact(event.target.user);
  // }

  return (
    <ul className='w-full h-52 overflow-scroll flex flex-col justify-start items-center px-6 gap-2'>
      {userListDev.map((user) => {
        return <UserItem key={user._id} user={user} />;
      })}
    </ul>
  );
}

const UserItem = ({ user }) => {
  return (
    <li className='w-full h-12 flex justify-between items-center bg-grey-200 '>
      <img className='h-full aspect-square object-cover rounded-full' src={user.img} alt={`User ${user.firstName}`} />
      <h2 className='h-full w-full ml-4 flex items-center text-xl border-b border-gray-400'>
        {user.firstName} {user.lastName}
      </h2>
      <button onClick={() => {}} className='text-black border-b border-gray-400 h-full'>
        <BsPlusCircle size='32' />
      </button>
    </li>
  );
};
