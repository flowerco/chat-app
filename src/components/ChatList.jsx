import Contact from './Contact';

const chatData = [
  { name: 'Bill', messages: ['Hi', 'How are you?'] },
  { name: 'Steve', messages: ['Hi', 'How are you?'] },
  { name: 'Chris', messages: ['Hi', 'How are you?'] },
];

export default function ChatList() {
  return (
    <ul className='h-1/2 w-full bg-orange-300 flex flex-col justify-center items-center'>
      {chatData.map((contact) => {
        return (
          <li>
            <Contact contact={contact} />
          </li>
        );
      })}
    </ul>
  );
}
