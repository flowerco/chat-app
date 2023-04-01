// Modal popup for either creating account, adding contact or creating new chat.

import { useContext } from "react";
import { ScreenContext } from "../App";
import { search } from "../lib/api";
import SearchableList from "./SearchableList";
import SearchBar from "./SearchBar";
import UserList from "./UserList";

const modalTypes = {
  CHAT: {
    bgColor: 'bg-pink-500',
    text: "I'm a chat Modal",
  },
  CONTACTS: {
    bgColor: 'bg-orange-500',
    text: "I'm a contacts Modal",
  }
};

export default function Modal() {
  const { screenState, setScreenState } = useContext(ScreenContext);

  const handleClick = (event) => {
    setScreenState({
      ...screenState,
      modalState: false
    })
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-5/12 h-96 bg-slate-200 rounded-3xl flex flex-col justify-around items-center shadow-xl z-20" >
        <SearchableList listType={'CONTACTS'}/>
        <div className="w-full flex justify-end pr-4 my-4">
          <button className='bg-blue-600 text-white font-semibold px-4 py-2 rounded-md' onClick={handleClick}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}