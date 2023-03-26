// Modal popup for either creating account, adding contact or creating new chat.

export default function Modal({ childForm }) {
  return (
    <div className="absolute w-full h-full flex justify-center items-center">
      <div className="h-72 w-4/12 bg-slate-200 rounded-md flex justify-center items-center" >
        I'm a Modal Popup!
        {childForm}
      </div>
    </div>
  )
}