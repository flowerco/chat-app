import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEditMode } from '../../redux/screenSlice';
import SearchBar from '../SearchBar';
import UserList from '../UserList';

export default function SidebarList({ userList, typeName }) {

  const screenState = useSelector(state => state.screen);
  const dispatch = useDispatch();

  const [searchString, setSearchString] = useState('');

  const toggleEdit = () => {
    dispatch(setEditMode(!screenState.editMode));
  };

  const handleSearch = (string) => {
    // TODO: This should probably set a userListState, based on filtering an input userList, or something like that.
    // Having the filter in every rerender of the UserList isn't ideal, we could just run it on search here.
    setSearchString(string.toLowerCase());
  };

  return (
    <div className='h-full w-full flex flex-col'>
      <SearchBar type={typeName} callback={handleSearch} />
      <div className='w-full'>
        {userList.length > 0 ? (
          <UserList
            users={userList.filter((user) =>
              searchString
                ? [user.firstName, user.lastName]
                    .join(' ').toLowerCase()
                    .includes(searchString)
                : true
            )}
            edit={screenState.editMode}
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
              screenState.editMode ? 'bg-green-600' : 'bg-blue-600'
            }`}
          >
            {screenState.editMode ? 'Done' : 'Edit'}
          </button>
        )}
      </div>
    </div>
  );
}
