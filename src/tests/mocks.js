export const mockUser = {
  _id: '000aa12345bb',
  firstName: 'Blank',
  lastName: 'Blankenstein',
  userImg: '',
  contacts: [],
  chats: [],
  currentChat: '',
  keepTime: 10,
  isSearchable: false,
  __v: 63,
};

export const mockContacts = [
  {
    firstName: 'Connie',
    lastName: 'Tact',
    _id: '000cc67890dd',
    _userImg: 'image.link',
  },
];

export const mockChats = [
  {
    _id: 'chat1234',
    userList: [
      {
        firstName: 'Connie',
        lastName: 'Tact',
        _id: '000cc67890dd',
        _userImg: 'image.link',
      },
    ],
  },
];
