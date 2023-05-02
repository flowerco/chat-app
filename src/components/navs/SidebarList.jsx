import { useState } from 'react';
import SearchBar from '../SearchBar';
import UserList from '../UserList';

export default function SidebarList({ userList, typeName }) {
  const [edit, setEdit] = useState(false);
  const [searchString, setSearchString] = useState('');

  const toggleEdit = () => {
    setEdit(!edit);
  };

  const handleSearch = (string) => {
    // TODO: This should probably set a userListState, based on filtering an input userList, or something like that.
    // Having the filter in every rerender of the UserList isn't ideal, we could just run it on search here.
    setSearchString(string.toLowerCase());
  };

  return (
    <div className='h-full w-full flex flex-col'>
      <SearchBar type={typeName} callback={handleSearch} />
      <div className='w-full flex-grow'>
        {userList.length > 0 ? (
          <UserList
            users={userList.filter((user) =>
              searchString
                ? [user.firstName, user.lastName]
                    .join(' ').toLowerCase()
                    .includes(searchString)
                : true
            )}
            edit={edit}
            type={typeName}
          />
        ) : (
          <p className='text-center'>
            No {typeName.toLowerCase()} here yet, let's add some!
          </p>
        )}
      </div>
      <div className='flex justify-end p-4'>
        {userList.length > 0 && (
          <button
            onClick={toggleEdit}
            className={`rounded-md py-2 px-8 font-bold text-white ${
              edit ? 'bg-green-600' : 'bg-blue-600'
            }`}
          >
            {edit ? 'Done' : 'Edit'}
          </button>
        )}
      </div>
    </div>
  );
}
