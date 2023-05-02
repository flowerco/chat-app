// Modal popup for either creating account, adding contact or creating new chat.

import { useContext } from "react";
import { ScreenContext } from "../App";
import SearchableList from "./SearchableList";

export default function Modal({ type }) {
  const { screenState, setScreenState } = useContext(ScreenContext);

  const handleClick = (event) => {
    setScreenState({
      ...screenState,
      modalState: 'NONE'
    })
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-5/12 h-96 bg-slate-200 rounded-3xl flex flex-col justify-around items-center shadow-xl z-20" >
        <SearchableList listType={type}/>
        <div className="w-full flex justify-end pr-4 my-4">
          <button className='bg-blue-600 text-white font-semibold px-4 py-2 rounded-md' onClick={handleClick}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}