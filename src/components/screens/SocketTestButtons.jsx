import { socket } from "../../lib/socket";

export default function SocketTestButtons () {
  return (
    <div className='flex flex-col justify-center items-center fixed m-auto gap-2' >
    <button
      className='px-8 h-20 text-white bg-primary rounded-md'
      onClick={(e) => socket.connect()}
    >
      Connect
    </button>
    <button
      className='px-8 h-20 text-white bg-primary rounded-md'
      onClick={(e) => socket.disconnect()}
    >
      Disconnect
    </button>
    <button
      className='px-8 h-20 text-white bg-primary rounded-md'
      onClick={(e) => socket.emit('join-chat', '1000234', 'Sam')}
    >
      Join
    </button>
    <button
      className='px-8 h-20 text-white bg-primary rounded-md'
      onClick={(e) => socket.emit('send-message', 'wibble')}
    >
      Emit
    </button>
  </div>
  )
}