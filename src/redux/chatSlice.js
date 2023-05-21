import { createSlice } from "@reduxjs/toolkit";


const mockChats = [
  {
    _id: '646167d3681aa1995ff3b5ab',
    userList: ['644f91e25dd6e3a045fa7cd6', '644f98214cb784ed82566245'],
    bubbleList: [
      {
        _id: '644f98214cb784ed82566245',
        timeStamp: new Date(Date.now() - 10 * 60000),
        text: "Hi, this is Testmore. Without concern for one's personal safety it seems appropriate to enquire whether or not you might prefer to engage in a ribald conversation the like of which shall not be heard of for many an age, perhap until the next ice age hath come and gone yonder from the great plains and shores of our fair land. Or nah?",
      },
      {
        _id: '644f91e25dd6e3a045fa7cd6',
        timeStamp: new Date(Date.now()),
        text: 'Hi Testy. Not bad thanks!',
      },
    ],
  },
  {
    _id: '645fcb6ab45eea8e8987e3c2',
    userList: ['644f91e25dd6e3a045fa7cd6', '644f94bd2cc7d61b26df5924'],
    bubbleList: [
      {
        _id: '644f98214cb784ed82566245',
        timeStamp: new Date(Date.now() - 10 * 60000),
        text: 'Bonjour, mon amis.',
      },
      {
        _id: '644f91e25dd6e3a045fa7cd6',
        timeStamp: new Date(Date.now()),
        text: 'Whaaaasssuuuup?',
      },
    ],
  },
];

export const chatSlice = createSlice({
  name: 'chat',
  initialState: mockChats,
  reducers: {
    chatAddMessage: (state, action) => {
      const { chatId, senderId, message } = action.payload;
      console.log('Adding new message to state');
    }
  }
});

export const {
  chatAddMessage
} = chatSlice.actions;

export default chatSlice.reducer;